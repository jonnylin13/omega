import { MasterServer } from "../net/server/server";
import { Session } from "../net/server/session";
import * as bcrypt from 'bcrypt';
import * as sha from 'sha.js'
import { Config } from "../util/config";
import { MapleSessionCoordinator, AntiMultiClientResult } from "../net/server/coordinator/session/session-coordinator";
import { CharNameAndId, MapleCharacter } from "./character/character";
import { LoginPackets } from "../util/packets/login-packets";
import { AccountDB } from "../util/db/account";
import { AES } from "../net/crypto/aes";
import { CharacterDB } from "../util/db/character";
import { MaplePacketEncoder } from '../net/crypto/packet-encoder';


export class MapleClient {

    static LOGIN = {
        LOGGED_OUT: 0,
        SERVER_TRANSITION: 1,
        LOGGED_IN: 2
    };

    private login_attempts = 0;
    private server_transition: boolean = false;
    logged_in = false;
    gm_level: number;
    session: Session;
    hwid: string = null;
    birthday: Date = null;
    pic: string = '';
    pin: string = '';
    pic_attempts: number = 0;
    pin_attempts: number = 0;
    cs_attempts: number = 0;
    account_id: number = -4;
    private banned: boolean;
    account_name: string;
    password_hash: string;
    gender: number = -1;
    character_slots: number = 3;
    language: number = 0;
    macs: Array<string> = [];
    temp_ban: Date;
    greason: number;
    disconnecting: boolean = false;
    player: MapleCharacter;
    last_pong: bigint;
    world_id: number;
    channel_id: number = 1;
    num_worlds_visible: number;
    last_npc_click: bigint;
    last_packet: bigint = BigInt(new Date().getUTCMilliseconds());
    send: AES;
    receive: AES;
    session_id: string;

    // vote_points, vote_time, engines

    constructor(send: AES, receive: AES, session: Session) {
        this.send = send;
        this.receive = receive;
        this.session = session;
        this.session_id = session.id;
        session.client = this;
    }

    update_last_packet(): void {
        this.last_packet = BigInt(new Date().getUTCMilliseconds());
    }

    pong_received(): void {
        this.last_pong = MasterServer.get_instance().get_current_time();
    }

    announce(packet: Buffer) {
        let encrypted = MaplePacketEncoder.encode(this.session, packet);
        this.session.write(encrypted);
    }

    disconnect(shutdown: boolean, cash_shop: boolean) {
        if (this.player !== null && this.player !== undefined && this.player.logged_in && this.player.client !== null && this.player.client !== undefined) {
            // TODO: Needs implementation
        }

        if (!this.server_transition && this.logged_in) {
            MapleSessionCoordinator.get_instance().close_session(this.session, false);
            this.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
            this.session.client = null;
            this.clear();
        } else {
            if (this.session.client) {
                MapleSessionCoordinator.get_instance().close_session(this.session, false);
                this.session.client = null;
            }

            if (!MasterServer.get_instance().has_character_in_transition(this)) {
                this.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
            }
        }
    }

    clear() {
        if (this.player) {
            // this.player.empty(true);
        }

        MasterServer.get_instance().unregister_login_state(this);

        delete this.account_name;
        delete this.macs;
        delete this.hwid;
        delete this.birthday;
        // delete this.engines;
        delete this.player;
        // delete this.receive;
        // delete this.send;

    }

    // TODO: Needs implementation
    accept_tos(): boolean {
        return true;
    }

    // TODO: Needs implementation
    finish_login(): number {
        return 1;
    } 

    // TODO: Needs implementation
    can_bypass_pin(): boolean {
        return false;
    }

    // TODO: Needs implementation
    can_bypass_pic(): boolean {
        return false;
    }

    // TODO: Needs implementation
    check_pin(pin: string): boolean {
        return false;
    }

    // TODO: Needs implementation
    check_pic(pic: string): boolean {
        return false;
    }

    load_characters(server_id: number): Array<MapleCharacter> {
        let chars: Array<MapleCharacter> = [];
        this._load_characters(server_id).then(res => {
            for (let cni of res) {
                chars.push(MapleCharacter.load_from_db(cni.id, this, false));
            }
            return chars;
        }).catch(err => {
            // TODO: Handle error
        });
        return []; 
    }

    private async _load_characters(server_id: number): Promise<Array<CharNameAndId>> {
        return await CharacterDB.get_character_name_and_id(this.account_id, server_id);
    }

    // TODO: Needs implementation
    get_available_character_slots(): number {
        return 1;
    }

    // TODO: Needs implementation
    get_character_slots(): number {
        return 1;
    }

    async update_macs(macs: string) {
        this.macs = this.macs.concat(macs.split(', '));
        try {
            await AccountDB.update_macs(this.account_id, this.macs.join(', '));
        } catch (err) {
            // TODO: Handle error
        }
    }

    async update_hwid(new_hwid: string) {
        let split = new_hwid.split('_');
        if (split.length > 1 && split[1].length === 8) {
            let convert = split[1];
            let hwid = '';
            for (let i = convert.length - 2; i >= 0; i -= 2) 
                hwid += convert.substring(i, i + 2);

            hwid = hwid.slice(0, 4) + '-' + hwid.slice(4);
            try {
                await AccountDB.update_hwid(this.account_id, hwid);
            } catch (err) {
                // TODO: Handle error
            }
        } else this.disconnect(false, false);
    }

    async get_temp_ban_from_db(): Promise<Date> {
        try {

            let data = await AccountDB.get_temp_ban(this.account_id);
            let blubb = data.temp_ban;
            if (blubb == 0 || blubb == '2018-06-20 00:00:00.0') return null;
            this.temp_ban = new Date(blubb);
            return this.temp_ban;
        } catch (err) {
            // TODO: Handle error
            return null;
        }
    }

    async has_banned_ip(): Promise<boolean> {
        try {

            let count = await AccountDB.get_ip_ban(this.session.remoteAddress);
            if (count >= 1) return true;
        } catch (err) {
            // TODO: Handle error
        } finally {
            return false;
        }
    }

    async has_banned_mac(): Promise<boolean> {
        if (this.macs.length === 0) return false;

        try {
            let count = await AccountDB.get_mac_bans(this.macs);
            if (count >= 1) return true;
        } catch (err) {
            // TODO: Handle error
        } finally {
            return false;
        }
    }

    async update_login_state(new_state: number) {
        if (new_state === MapleClient.LOGIN.LOGGED_IN) {
            // TODO: MapleSessionCoordinator.get_instance().update_online_session(this.session);
        }
        try {
            await AccountDB.update_login_state(this.account_id, new_state, MasterServer.get_instance().get_current_time());
        } catch (err) {
            // TODO: Handle error
        }
        
        // TODO: Should we continue this code if error or return in the catch block?
        if (new_state === MapleClient.LOGIN.LOGGED_OUT) {
            this.logged_in = false;
            this.server_transition = false;
            this.account_id = 0;
        } else {
            this.server_transition = (new_state === MapleClient.LOGIN.SERVER_TRANSITION);
            this.logged_in = !this.server_transition;
        }
    }

    async get_login_state() {
        try {
            let data = await AccountDB.get_login_state(this.account_id);
            let state = data.logged_in;
            // From HeavenMS
            // birthday = Calendar.getInstance();
            // try {
            //     birthday.setTime(rs.getDate("birthday"));
            // } catch(SQLException e) {}
            if (state === MapleClient.LOGIN.SERVER_TRANSITION) {
                if (data.last_login + 30000 < MasterServer.get_instance().get_current_time()) {
                    // Not quite sure what this re-assigning does
                    // let account_id = this.account_id;
                    state = MapleClient.LOGIN.LOGGED_OUT;
                    await this.update_login_state(state);
                    // this.account_id = account_id;
                }
                if (state === MapleClient.LOGIN.LOGGED_IN) {
                    this.logged_in = true;
                } else if (state === MapleClient.LOGIN.SERVER_TRANSITION) {
                    await AccountDB.update_logged_in(this.account_id, 0);
                } else this.logged_in = false;
    
                return state;
            }
        } catch (err) {
            // TODO: Handle error
            return null;
        }
    }

    private check_hash(hash: string, pwd: string, type: string): boolean {
        return sha(type).update(pwd).digest('hex') === hash;
    }

    async login(user: string, pwd: string, nibble_hwid: string): Promise<number> {
        let loginok = 5;
        this.login_attempts++;
        if (this.login_attempts > 4) {
            this.logged_in = false;
            this.session.destroy();
            return 6;
        }

        try {
            let data = await AccountDB.get_account_login_info(this.account_id);
            this.account_id = data.id;
            if (this.account_id <= 0) {
                // TODO: Log error
                return 15;
            }
            this.banned = data.banned === 1;
            this.gm_level = 0;
            this.pin = data.pin;
            this.pic = data.pic;
            this.gender = data.gender;
            this.character_slots = data.character_slots;
            this.language = data.language;
            this.password_hash = data.password;
            let tos = data.tos;

            if (this.banned) return 3;

            let login_state = await this.get_login_state();
            let bcrypt_check = await bcrypt.compare(pwd, this.password_hash);

            if (login_state > MapleClient.LOGIN.LOGGED_OUT) {
                // Already logged in
                this.logged_in = false;
                loginok = 7;
            } else if (this.password_hash.charAt(0) === '$' && this.password_hash.charAt(1) === '2' && bcrypt_check) {
                loginok = (tos === 0) ? 23 : 0;
            } else if (pwd === this.password_hash || this.check_hash(this.password_hash, pwd, 'sha1') || this.check_hash(this.password_hash, pwd, 'sha256')) {
                loginok = (tos === 0) ? (!Config.properties.server.bcrypt_migration ? 23 : -23) : (Config.properties.server.bcrypt_migration ? 0 : -10);
            } else {
                this.logged_in = false;
                loginok = 4;
            }
        } catch (err) {
            // TODO: Log error
            this.account_id = -3;
        }

        if (loginok === 0 || loginok === 4) {
            let multiclient_result = await MapleSessionCoordinator.get_instance().attempt_login_session(this.session, nibble_hwid, this.account_id, loginok === 4);
            switch (multiclient_result) {
                case AntiMultiClientResult.SUCCESS:
                    if (loginok === 0) this.login_attempts = 0;
                    return loginok;
                case AntiMultiClientResult.REMOTE_LOGGED_IN:
                    return 17;
                case AntiMultiClientResult.REMOTE_REACHED_LIMIT:
                    return 13;
                case AntiMultiClientResult.REMOTE_PROCESSING:
                    return 10;
                case AntiMultiClientResult.MANY_ACCOUNT_ATTEMPTS:
                    return 16;
                default:
                    return 8;
            }
        } else {
            return loginok;
        }
        
    }

    static check_characters(account_id: number) {
        if (!Config.properties.server.use_character_account_check) return;
        for (let world of MasterServer.get_instance().worlds) {
            for (let chr of world.player_storage.get_all_players()) {
                if (account_id === chr.account_id) {
                    chr.client.force_disconnect();
                    world.player_storage.remove_player(chr);
                }
            }
        }
    }

    force_disconnect() {
        if (this.can_disconnect()) 
            this.disconnect(true, false);
    }

    private can_disconnect() {
        if (this.disconnecting) return false;
        this.disconnecting = true;
        return true;
    }

    set_character_on_session_transition_state(character_id: number) {
        this.update_login_state(MapleClient.LOGIN.SERVER_TRANSITION);
        this.session.in_transition = true;
        MasterServer.get_instance().set_character_id_in_transition(this, character_id);
    }

    requested_server_list(worlds: number) {
        this.num_worlds_visible = worlds;
        this.set_clicked_npc();
    }

    set_clicked_npc() {
        this.last_npc_click = MasterServer.get_instance().get_current_time();
    }

    send_char_list(server: number) {
        this.announce(LoginPackets.get_char_list(this, server, 0));
    }

}