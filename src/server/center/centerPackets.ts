import { CenterSendOpcode } from "../../protocol/opcodes/center/send";
import { PacketWriter } from "../../protocol/packets/packetWriter";
import { ServerType } from "../baseServer";


export class CenterPackets {
    static getWorkerHandshake() {
        const packet = new PacketWriter(3);
        packet.writeShort(CenterSendOpcode.WORKER_HANDSHAKE.getValue());
        packet.writeByte(ServerType.CENTER);
        return packet.getPacket();
    }

    static getPreLoginPasswordAck(found: boolean, obj: any) {
        const packet = new PacketWriter(found ? 1 : 0);
        packet.writeShort(CenterSendOpcode.PRE_LOGIN_PASSWORD_ACK.getValue());
        packet.writeBoolean(found);
        if (found) {
            packet.writeMapleAsciiString(obj.username);
            packet.writeInt(obj.id);
            packet.writeMapleAsciiString(obj.password);
            packet.writeByte(obj.gender);
            packet.writeBoolean(obj.banned);
            packet.writeMapleAsciiString(obj.pin);
            packet.writeMapleAsciiString(obj.pic);
            packet.writeByte(obj.character_slots);
            packet.writeBoolean(obj.tos);
            packet.writeByte(obj.language);
            return packet.getPacket();
        }
        packet.writeBoolean(found);
        packet.writeMapleAsciiString(obj.username);
        return packet.getPacket();
    }
}