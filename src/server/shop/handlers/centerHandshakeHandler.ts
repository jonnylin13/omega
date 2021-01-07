import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { ServerType } from "../../baseServer";
import { Session } from "../../session";
import { ShopPackets } from '../shopPackets';


export class CenterHandshakeHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {
        const serverType = packet.readByte();
        if (ServerType[serverType] === 'CENTER') {
            // Send handshake ack
            session.socket.write(ShopPackets.getCenterHandshakeAck());
        }
    }
}