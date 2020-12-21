import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { Config } from '../../../../util/config';
import { Convert } from "../../../../util/convert";
import { DatabaseConnection } from '../../../../util/db';



export class LoginPasswordHandler implements AbstractMaplePacketHandler {
    validate_state(c: MapleClient) {
        return c.is_logged_in();
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let remote_host = c.session.remoteAddress;
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
        let loginok = c.login(user, pwd, hwid_hex);

        if (Config.properties.server.automatic_register && loginok === 5) {
            
        }
    }
}