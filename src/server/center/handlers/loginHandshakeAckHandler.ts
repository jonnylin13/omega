import { PacketReader } from "../../../protocol/packet/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { ServerType } from '../../baseServer';
import { CenterServer } from "../centerServer";
import { CenterPackets } from "../centerPackets";


export class LoginHandshakeAckHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {
        const serverType = packet.readByte();
        if (ServerType[serverType] === 'LOGIN') {
            CenterServer.instance.loginServerSessionId = session.id;
            CenterServer.logger.info(`CenterServer registered a LoginServer with session id ${session.id}`);
        } else if (ServerType[serverType] === 'SHOP') {
            CenterServer.instance.shopServerSessionId = session.id;
            CenterServer.logger.info(`CenterServer registered a ShopServer with session id ${session.id}`);
        } else if (ServerType[serverType] === 'CHANNEL') return;
        else {
            CenterServer.logger.warn(`CenterServer tried to register a server of type ${serverType}`);
            return;
        }
    }
}