import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";



export class LoginPasswordHandler implements AbstractMaplePacketHandler {
    validate_state(c: MapleClient) {
        return c.is_logged_in();
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let remote_host = c.session.remoteAddress;
    }
}