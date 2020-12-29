import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { CenterServer } from "../centerServer";


export class AddLoginHandler implements PacketHandler {
    handlePacket(packet: PacketReader, session: Session): void {
        const accountId = packet.readInt();
        CenterServer.instance.loginStore.add(accountId);
        // TODO: ADD_LOGIN_ACK?
    }
    
}