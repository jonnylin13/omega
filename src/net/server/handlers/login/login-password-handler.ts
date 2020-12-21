import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { Config } from '../../../../util/config';
import { Convert } from "../../../../util/convert";
import { DatabaseConnection } from '../../../../util/db';
import * as bcrypt from 'bcrypt';
import * as sha from 'sha.js';
import { MasterServer } from "../../server";
import { MapleSessionCoordinator } from "../../coordinator/session/session-coordinator";



export class LoginPasswordHandler implements AbstractMaplePacketHandler {
    validate_state(c: MapleClient) {
        return c.logged_in;
    }

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let remote_host = MapleSessionCoordinator.get_remote_host(c.session);
        if (remote_host) {

            // TODO: Fix confusing if structure
            if (Config.properties.server.use_ip_validation) {
                if (remote_host.startsWith('127.')) {
                    if (!Config.properties.server.local_server) {
                        c.announce(LoginPackets.get_login_failed(13));
                        return;
                    }
                } else {
                    if (Config.properties.server.local_server) {
                        c.announce(LoginPackets.get_login_failed(13));
                        return;
                    }
                }
            }
        } else {
            LoginPackets.get_login_failed(14);
            return;
        }

        let user = slea.read_maple_ascii_string();
        let pwd = slea.read_maple_ascii_string();
        c.account_name = user;
        slea.skip(6);
        let hwid_nibbles = slea.read(6);
        let hwid_hex = Convert.int8_to_hexstr(hwid_nibbles);
        let loginok = await c.login(user, pwd, hwid_hex);

        if (Config.properties.server.automatic_register && loginok === 5) {
            let result = await DatabaseConnection.knex('accounts')
                .insert({
                    name: user,
                    password: Config.properties.server.bcrypt_migration ? bcrypt.hashSync(pwd, 12) : sha('sha256').update(pwd).digest('hex'),
                    birthday: '2018-06-20',
                    tempban: '2018-06-20'
                }, ['id']);
            if (result.length < 1) {
                c.account_id = -1;
                // TODO: Handle SQL error
            }
            loginok = await c.login(user, pwd, hwid_hex);
        }

        if (Config.properties.server.bcrypt_migration && (loginok <= -10)) { // -10 means bcrypt migration, -23 means TOS wasn't accepted
            let result = await DatabaseConnection.knex('accounts')
                .where({name: user})
                .update({password: bcrypt.hashSync(pwd, 12)}, ['id']);
            if (result.length < 1) {
                // TODO: Handle SQL error
            }
            loginok = (loginok == -10) ? 0 : 23;
        }
        let has_banned_ip = await c.has_banned_ip();
        let has_banned_mac = await c.has_banned_mac();
        if (has_banned_ip || has_banned_mac) {
            c.announce(LoginPackets.get_login_failed(3));
            return;
        }
        let temp_ban = await c.get_temp_ban_from_db();
        if (temp_ban !== null || temp_ban !== undefined) {
            if (temp_ban.getUTCMilliseconds() > new Date().getUTCMilliseconds()) {
                c.announce(LoginPackets.get_temp_ban(BigInt(temp_ban.getUTCMilliseconds()), c.greason));
                return;
            }
        }
        if (loginok === 3) {
            c.announce(LoginPackets.get_perma_ban(c.greason));
            return;
        } else if (loginok !== 0) {
            c.announce(LoginPackets.get_login_failed(loginok));
            return;
        }
        if (c.finish_login() === 0) {
            MapleClient.check_characters(c.account_id);
            LoginPasswordHandler.login(c);
        } else {
            c.announce(LoginPackets.get_login_failed(7));
        }

    }

    private static login(c: MapleClient) {
        c.announce(LoginPackets.get_auth_success(c));
        MasterServer.get_instance().register_login_state(c);
    }
}