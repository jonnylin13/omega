import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MapleSessionCoordinator } from "../../coordinator/session/session-coordinator";
import { MasterServer } from "../../server";



export class SetGenderHandler extends AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return true;
    }

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        if (c.gender === 10) {
            let confirmed = slea.read_byte();
            if (confirmed === 0x01) {
                c.gender = slea.read_byte();
                c.announce(LoginPackets.get_auth_success(c));
                MasterServer.get_instance().register_login_state(c);
            } else {
                MapleSessionCoordinator.get_instance().close_session(c.session, false);
                c.update_login_state(MapleClient.LOGIN.LOGGED_OUT);
            }
        }
    }
}