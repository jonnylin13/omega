import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Session } from "../../session";
import { CenterPackets } from "../centerPackets";
import { AccountDB } from "../db/account";


export class PreLoginPasswordHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {
        // username
        const username = packet.readMapleAsciiString();
        const preLoginInfo = await AccountDB.getPreLoginInfo(username);
        if (preLoginInfo === undefined) {
            session.write(CenterPackets.getPreLoginPasswordAck(false, {username: username}));
            return;
        }
        session.write(CenterPackets.getPreLoginPasswordAck(true, {username: username, id: preLoginInfo.id, password: preLoginInfo.password, 
            gender: preLoginInfo.gender, banned: preLoginInfo.banned, pin: preLoginInfo.pin, pic: preLoginInfo.pic, 
            character_slots: preLoginInfo.character_slots, tos: preLoginInfo.tos, language: preLoginInfo.language}));
    }
    
}