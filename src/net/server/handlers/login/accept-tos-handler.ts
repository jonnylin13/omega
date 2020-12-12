import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login/login-packets";
import { MaplePacketHandler } from "../../../packet-handler";


export class AcceptTOSHandler implements MaplePacketHandler {
    validate_state(c: MapleClient) {
        return c.is_logged_in();
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        if (slea.available() === 0 || slea.read_byte() !== 1 || c.accept_tos()) {
            c.disconnect(false, false);
            return;
        }
        if (c.finish_login() === 0)
            c.announce(LoginPackets.get_auth_success(c));
        else c.announce(LoginPackets.get_login_failed(9));
    }
}