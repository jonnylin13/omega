import { PacketReader } from "../../protocol/packets/packetReader";


export class LoginService {

    static readPreLoginInfo(packet: PacketReader) {

        const id = packet.readInt();
        const hashedPassword = packet.readMapleAsciiString();
        const gender = packet.readByte();
        const banned = packet.readBoolean();
        const pin = packet.readMapleAsciiString();
        const pic = packet.readMapleAsciiString();
        const character_slots = packet.readByte();
        const tos = packet.readBoolean();
        const language = packet.readByte();

        return {id, hashedPassword, gender, banned, pin, pic, character_slots, tos, language};

    }

}