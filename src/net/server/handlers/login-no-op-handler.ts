import { MapleClient } from "../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../util/data/input/interface/seekable-lea";
import { MaplePacketHandler } from "./interface/packet-handler";


export class LoginRequiringNoOpHandler implements MaplePacketHandler {
    private static instance = new LoginRequiringNoOpHandler();

    static get_instance() {
        return this.instance;
    }

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {}

    validate_state(c: MapleClient) {
        return c.logged_in;
    }
}