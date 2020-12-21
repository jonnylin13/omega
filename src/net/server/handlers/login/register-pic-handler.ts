import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { AntiMultiClientResult } from "../../coordinator/session/session-coordinator";


export class RegisterPICHandler extends AbstractMaplePacketHandler {

    private static parse_anti_multiclient_error(res: AntiMultiClientResult): number {
        switch (res) {
            case AntiMultiClientResult.REMOTE_PROCESSING:
                return 10;
            case AntiMultiClientResult.REMOTE_LOGGED_IN:
                return 7;
            case AntiMultiClientResult.REMOTE_NO_MATCH:
                return 17;
            case AntiMultiClientResult.COORDINATOR_ERROR:
                return 8;
            default:
                return 9;
        }
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {

    }

    validate_state(c: MapleClient): boolean {
        return true;
    }
}