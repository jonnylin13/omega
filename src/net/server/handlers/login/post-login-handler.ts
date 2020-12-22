import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";


export class PostLoginHandler extends AbstractMaplePacketHandler {
    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let c2 = slea.read_byte();
        let c3 = 5;
        if (slea.available() > 0) {
            c3 = slea.read_byte();
        }
        if (c2 == 1 && c3 == 1) {
            if (c.pin === null || c.pin === '') {
                c.announce(LoginPackets.register_pin());
            } else {
                c.announce(LoginPackets.request_pin());
            }
        } else if (c2 == 1 && c3 == 0) {
            let pin = slea.read_maple_ascii_string();
            if (c.check_pin(pin)) {
                c.announce(LoginPackets.pin_accepted());
            } else {
                c.announce(LoginPackets.request_pin_after_failure());
            }
        } else if (c2 == 2 && c3 == 0) {
            let pin = slea.read_maple_ascii_string();
            if (c.check_pin(pin)) {
                c.announce(LoginPackets.register_pin());
            } else {
                c.announce(LoginPackets.request_pin_after_failure());
            }
        } else if (c2 == 0 && c3 == 5) {
            c.session.destroy();
            // TODO: Needs validation
            // MapleSessionCoordinator.get_instance().close_session(c.session, null);
            c.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
        }
    }

    validate_state(c: MapleClient): boolean {
        return true;
    }
}