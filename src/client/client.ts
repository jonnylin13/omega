import { MasterServer } from "../net/server/server";
import { Session } from "../net/server/session";
import { DatabaseConnection } from "../util/db";
import * as bcrypt from 'bcrypt';
import * as sha from 'sha.js'
import { Config } from "../util/config";
import { MapleSessionCoordinator, AntiMultiClientResult } from "../net/server/coordinator/session/session-coordinator";
import { MapleCharacter } from "./character";
import { World } from "../net/server/world/world";


export class MapleClient {

    static LOGIN = {
        LOGGED_OUT: 0,
        SERVER_TRANSITION: 1,
        LOGGED_IN: 2
    };

    private login_attempts = 0;
    private server_transition: boolean;
    logged_in = false;
    gm_level: number;
    session: Session;
    hwid: string;
    birthday: Date;
    pic: string;
    pin: string;
    account_id: number;
    private banned: boolean;
    account_name: string;
    password_hash: string;
    gender: number;
    character_slots: number;
    language: number;
    macs: Array<string> = [];
    temp_ban: Date;
    greason: number;
    disconnecting: boolean;
    player: MapleCharacter;
    last_pong: bigint;
    world_id: number;
    channel_id: number;

    pong_received(): void {
        this.last_pong = MasterServer.get_instance().get_current_time();
    }

    announce(packet: Buffer) {
        this.session.write(packet);
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

    async update_macs(macs: string) {
        this.macs = this.macs.concat(macs.split(', '));
        let result = await DatabaseConnection.knex('accounts')
            .where({id: this.account_id})
            .update({macs: this.macs.join(', ')});
        if (result.length === 0) {
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
            let result = DatabaseConnection.knex('accounts')
                .where({id: this.account_id})
                .update({hwid: hwid});
            if (result.length === 0) {
                // TODO: Handle error
            }
        } else this.disconnect(false, false);
    }

    async get_temp_ban_from_db(): Promise<Date> {
        let rows = await DatabaseConnection.knex('accounts')
            .where({id: this.account_id})
            .select('temp_ban');
        if (rows.length > 0) {
            let data = rows[0];
            let blubb = data.temp_ban;
            if (blubb == 0 || blubb == '2018-06-20 00:00:00.0') return null;
            this.temp_ban = new Date(blubb);
            return this.temp_ban;

        } else return null;
    }

    async has_banned_ip(): Promise<boolean> {
        let rows = await DatabaseConnection.knex('ip_bans')
            .where(this.session.remoteAddress, 'like', `CONCAT(ip, '%')`)
            .count({count: '*'});
        let result = false;
        if (rows.length > 0) {
            let count = rows[0]['COUNT(*)'];
            if (count >= 1) result = true;
        }
        return result;
    }

    async has_banned_mac(): Promise<boolean> {
        if (this.macs.length === 0) return false;

        let rows = await DatabaseConnection.knex('mac_bans')
            .where('mac', 'in', this.macs.join(', '))
            .count({count: '*'});
        let result = false;
        if (rows.length > 0) {
            let count = rows[0]['COUNT(*)'];
            if (count >= 1) result = true;
        }
        return result;
    }

    async update_login_state(new_state: number) {
        if (new_state === MapleClient.LOGIN.LOGGED_IN) {
            // TODO: MapleSessionCoordinator.get_instance().update_online_session(this.session);
        }

        // TODO: Check result
        let result = await DatabaseConnection.knex('accounts')
            .where({id: this.account_id})
            .update({logged_in: new_state, last_login: MasterServer.get_instance().get_current_time()});

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
        let rows = await DatabaseConnection.knex
            .where({id: this.account_id})
            .select('logged_in', 'last_login', 'birthday')
            .from('accounts');
        if (rows.length > 0) {

            // From HeavenMS
            // birthday = Calendar.getInstance();
            // try {
            //     birthday.setTime(rs.getDate("birthday"));
            // } catch(SQLException e) {}

            let data = rows[0];
            let state = data.logged_in;
            if (state === MapleClient.LOGIN.SERVER_TRANSITION) {
                if (data.last_login + 30000 < MasterServer.get_instance().get_current_time()) {

                    // Not quite sure what this re-assigning does
                    // let account_id = this.account_id;
                    state = MapleClient.LOGIN.LOGGED_OUT;
                    await this.update_login_state(state);
                    // this.account_id = account_id;

                }
            }

            if (state === MapleClient.LOGIN.LOGGED_IN) {
                this.logged_in = true;
            } else if (state === MapleClient.LOGIN.SERVER_TRANSITION) {
                // TODO: Check result
                let result = await DatabaseConnection.knex('accounts')
                    .where({id: this.account_id})
                    .update({logged_in: 0});

            } else this.logged_in = false;

            return state;
 
        } else {
            // TODO: Handle account not found
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

        let rows = await DatabaseConnection.knex
            .where({name: user})
            .select('id', 'password', 'gender', 'banned', 'pin', 'pic', 'character_slots', 'tos', 'language')
            .from('accounts');
        if (rows.length > 0) {
            let data = rows[0];
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
        } else {
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

}