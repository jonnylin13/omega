import { PacketWriter } from '../../protocol/packet/packetWriter';
import { LoginSendOpcode } from '../../protocol/opcode/login/send';
import { ServerType } from '../baseServer';


export class LoginPackets {

    static getCenterHandshakeAck(): Buffer {
        const packet = new PacketWriter(3);
        packet.writeShort(LoginSendOpcode.CENTER_HANDSHAKE_ACK.getValue());
        packet.writeByte(ServerType.LOGIN);
        return packet.getPacket();
    }

}