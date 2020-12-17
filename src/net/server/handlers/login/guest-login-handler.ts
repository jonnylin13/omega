import { AbstractMaplePacketHandler } from '../../../abstract-packet-handler';
import { SeekableLittleEndianAccessor } from '../../../../util/data/input/interface/seekable-lea';
import { MapleClient } from '../../../../client/client';
import { LoginPackets } from '../../../../util/packets/login-packets';
import { LoginPasswordHandler } from './login-password-handler';


export class GuestLoginHandler implements AbstractMaplePacketHandler {
    handlePacket(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        c.announce(LoginPackets.send_guest_tos());
        // TODO: Needs validation
        new LoginPasswordHandler().handle_packet(slea, c);
    }

    validate_state(c: MapleClient): boolean {
        return true;
    }
}