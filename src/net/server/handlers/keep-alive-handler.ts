import { MapleClient } from "../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../util/data/input/interface/seekable-lea";
import { MaplePacketHandler } from '../interface/packet-handler';


export class KeepAliveHandler implements MaplePacketHandler {
    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        c.pong_received();
    }

    validate_state(c: MapleClient): boolean {
        return true;
    }
}