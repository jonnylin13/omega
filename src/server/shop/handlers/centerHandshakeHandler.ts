import { PacketReader } from "../../../protocol/packet/packetReader";
import { PacketHandler } from "../../baseHandler";
import { ServerType } from "../../baseServer";
import * as net from 'net';
import { ShopPackets } from '../shopPackets';


export class CenterHandshakeHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, socket: net.Socket): Promise<void> {
        const serverType = packet.readByte();
        if (ServerType[serverType] === 'CENTER') {
            // Send handshake ack
            socket.write(ShopPackets.getCenterHandshakeAck());
        }
    }
}