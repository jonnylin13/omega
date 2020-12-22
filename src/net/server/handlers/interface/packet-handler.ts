import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { MapleClient } from '../../../../client/client';


export interface MaplePacketHandler {
    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient): void;
    validate_state(c: MapleClient): boolean;
}