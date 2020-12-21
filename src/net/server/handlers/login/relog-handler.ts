import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MapleClient } from '../../../../client/client';
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";


export class RelogRequestHandler extends AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return !c.logged_in;
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        c.announce(LoginPackets.get_relog_response());
    }
}