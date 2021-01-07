import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { CenterPackets } from "../centerPackets";
import { AccountDB } from "../db/account";


export class PreLoginPasswordHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {

        const sessionId = packet.readInt();
        const username = packet.readMapleAsciiString();
        const preLoginInfo = await AccountDB.getPreLoginInfo(username);
        if (preLoginInfo === undefined) {
            session.socket.write(CenterPackets.getPreLoginPasswordAck(false, {sessionId: sessionId, username: username}));
            return;
        }
        session.socket.write(CenterPackets.getPreLoginPasswordAck(true, {sessionId: sessionId, username: username, id: preLoginInfo.id, password: preLoginInfo.password, 
            gender: preLoginInfo.gender, banned: preLoginInfo.banned, pin: preLoginInfo.pin, pic: preLoginInfo.pic, 
            character_slots: preLoginInfo.character_slots, tos: preLoginInfo.tos, language: preLoginInfo.language}));
    }
    
}