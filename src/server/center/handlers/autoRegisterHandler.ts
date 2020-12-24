import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { CenterPackets } from "../centerPackets";
import { AccountDB } from "../db/account";


export class AutoRegisterHandler implements PacketHandler {

    async handlePacket(packet: PacketReader, session: Session): Promise<void> {
        const sessionId = packet.readInt();
        const username = packet.readMapleAsciiString();
        const hashedPassword = packet.readMapleAsciiString();
        const result = await AccountDB.insertAutoRegisterAccount(username, hashedPassword);
        session.write(CenterPackets.getAutoRegisterAck(sessionId, result));
    }
    
}