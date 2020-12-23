import { CenterSendOpcode } from "../../protocol/opcode/center/send";
import { PacketWriter } from "../../protocol/packet/packetWriter";
import { ServerType } from "../baseServer";


export class CenterPackets {
    static getWorkerHandshake() {
        const packet = new PacketWriter(3);
        packet.writeShort(CenterSendOpcode.WORKER_HANDSHAKE.getValue());
        packet.writeByte(ServerType.CENTER);
        return packet.getPacket();
    }
}