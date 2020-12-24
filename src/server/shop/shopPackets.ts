import { PacketWriter } from '../../protocol/packets/packetWriter';
import { CommonSendOpcode } from '../../protocol/opcodes/common/send';
import { ServerType } from '../baseServer';


export class ShopPackets {

    static getCenterHandshakeAck(): Buffer {
        const packet = new PacketWriter(3);
        packet.writeShort(CommonSendOpcode.CENTER_HANDSHAKE_ACK.getValue());
        packet.writeByte(ServerType.SHOP);
        return packet.getPacket();
    }

}