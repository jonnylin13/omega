import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { ServerType } from '../../baseServer';
import { CenterServer } from "../centerServer";


export class CenterHandshakeAckHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {
        const serverType = packet.readByte();
        if (ServerType[serverType] === 'LOGIN') {
            CenterServer.instance.loginServerSessionId = session.id;
            CenterServer.instance.logger.info(`CenterServer registered a LoginServer with session id ${session.id}`);
        } else if (ServerType[serverType] === 'SHOP') {
            CenterServer.instance.shopServerSessionId = session.id;
            CenterServer.instance.logger.info(`CenterServer registered a ShopServer with session id ${session.id}`);
        } else if (ServerType[serverType] === 'CHANNEL') return;
        else {
            CenterServer.instance.logger.warn(`CenterServer tried to register a server of type ${serverType}`);
            return;
        }
    }
}