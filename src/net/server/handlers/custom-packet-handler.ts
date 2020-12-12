import { MapleClient } from "../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../util/packets/login-packets";
import { MaplePacketHandler } from '../../packet-handler';


export class CustomPacketHandler implements MaplePacketHandler {

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        if (slea.available() > 0 && c.get_gm_level() === 4)
            c.announce(LoginPackets.custom_packet(slea.read(slea.available())));
    }

    validate_state(c: MapleClient) {
        return true;
    }
}