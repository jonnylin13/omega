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
        const packetLength = (found ? obj.password.length + obj.pin.length + obj.pic.length + 15 : 0) + 7;
        const packet = new PacketWriter(packetLength);
        packet.writeShort(CenterSendOpcode.PRE_LOGIN_ACK.getValue());
        packet.writeInt(obj.sessionId);
        packet.writeBoolean(found);
        if (found) {
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
        return packet.getPacket();
    }

    static getAutoRegisterAck(sessionId: number, result: any): Buffer {
        const packet = new PacketWriter((result !== undefined ? result.password.length + result.pin.length + result.pic.length + 15 : 0) + 7);
        packet.writeShort(CenterSendOpcode.AUTO_REGISTER_ACK.getValue());
        packet.writeInt(sessionId);
        packet.writeBoolean(result !== undefined); // Success
        if (result !== undefined) {
            packet.writeInt(result.id);
            packet.writeMapleAsciiString(result.password);
            packet.writeByte(result.gender);
            packet.writeBoolean(result.banned);
            packet.writeMapleAsciiString(result.pin);
            packet.writeMapleAsciiString(result.pic);
            packet.writeByte(result.character_slots);
            packet.writeBoolean(result.tos);
            packet.writeByte(result.language);
        }
        return packet.getPacket();
    }
}