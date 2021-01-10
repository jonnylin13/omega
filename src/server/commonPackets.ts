import { MapleSendOpcode } from "../protocol/opcodes/maple/send";
import { PacketWriter } from "../protocol/packets/packetWriter";


export class CommonPackets {
    static getPing(): Buffer {
        const packet = new PacketWriter(2);
        packet.writeShort(MapleSendOpcode.PING.getValue());
        return packet.getPacket();
    }
}