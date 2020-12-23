import { PacketReader } from "../../../protocol/packet/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Socket } from 'net';
import { Convert } from "../../../util/convert";


export class LoginPasswordHandler implements PacketHandler {
    handlePacket(packet: PacketReader, socket: Socket): void {

        const login = packet.readMapleAsciiString();
        const password = packet.readMapleAsciiString();
        packet.skip(6);
        const hwidBytes = packet.read(4);
        const hwid = new Convert.buffer(hwidBytes).toHexString();
    }
}