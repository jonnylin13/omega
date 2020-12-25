import { EncryptedSession } from "../../protocol/crypto/encryptedSession";
import { PacketReader } from "../../protocol/packets/packetReader";
import { LoginPackets } from "./loginPackets";
import { PreLoginClient } from "./types/preLoginClient";
import * as bcrypt from 'bcrypt';


export class LoginService {

    static readLoginInfo(packet: PacketReader) {

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

    static async login(preLoginClient: PreLoginClient, encSession: EncryptedSession, loginInfo: any) {

        const {id, hashedPassword, gender, banned, pin, pic, character_slots, tos, language} = loginInfo;

        // TODO: Check if ip banned or mac banned or temp banned
        if (banned) return; // TODO: Return correct ban message

        // TODO: Check if multiclient
        
        if (!tos) encSession.write(LoginPackets.getLoginFailed(23));

        // Compare password
        const success = await bcrypt.compare(preLoginClient.password, hashedPassword);
        if (!success) {
            // Wrong password
            encSession.write(LoginPackets.getLoginFailed(4));
            return;
        }
        // TODO: Check if already logged in

        // Success
        // TODO: Return authentication success packet
    }

}