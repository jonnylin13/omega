import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MapleSessionCoordinator } from "../../coordinator/session/session-coordinator";



export class RegisterPinHandler extends AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return true;
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let c2 = slea.read_byte();
        if (c2 === 0) {
            MapleSessionCoordinator.get_instance().close_session(c.session, false);
            c.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
        } else {
            let pin = slea.read_maple_ascii_string();
            if (pin != null && pin != undefined) {
                c.pin = pin;
                c.announce(LoginPackets.pin_registered());
                MapleSessionCoordinator.get_instance().close_session(c.session, false);
                c.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
            }
        }
    }
}