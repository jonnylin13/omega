import { Socket } from "net";
import { PacketReader } from "../../../protocol/packet/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { ServerType } from '../../baseServer';
import { CenterServer } from "../centerServer";


export class LoginHandshakeAckHandler implements PacketHandler {
    handlePacket(packet: PacketReader, session: Session): void {
        const serverType = packet.readByte();
        if (ServerType[serverType] === 'LOGIN') CenterServer.instance.loginServerId = session.id;
    }
    
}