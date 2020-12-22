import { MapleClient } from "../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../util/packets/login-packets";
import { MaplePacketHandler } from '../interface/packet-handler';


export class CustomPacketHandler implements MaplePacketHandler {

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        if (slea.available() > 0 && c.gm_level === 4)
            c.announce(LoginPackets.custom_packet(slea.read(slea.available())));
    }

    validate_state(c: MapleClient) {
        return true;
    }
}