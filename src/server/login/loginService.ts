import { EncryptedSession } from "../../protocol/crypto/encryptedSession";
import { PacketReader } from "../../protocol/packets/packetReader";
import { LoginPackets } from "./loginPackets";
import { PreLoginClient } from "./types/preLoginClient";
import * as bcrypt from 'bcrypt';
import { LoginServer } from "./loginServer";
import { LoginClient } from "./types/loginClient";


export class LoginService {

    static readLoginInfo(packet: PacketReader) {

        const id = packet.readInt();
        const hashedPassword = packet.readMapleAsciiString();
        const gender = packet.readByte();
        const banned = packet.readBoolean();
        const pin = packet.readMapleAsciiString();
        const pic = packet.readMapleAsciiString();
        const characterSlots = packet.readByte();
        const tos = packet.readBoolean();
        const language = packet.readByte();
        const gm = packet.readByte();

        return {id, hashedPassword, gender, banned, pin, pic, characterSlots, tos, language, gm};

    }

    static async login(preLoginClient: PreLoginClient, encSession: EncryptedSession, loginInfo: any, autoRegister: boolean = false) {

        const {id, hashedPassword, gender, banned, pin, pic, characterSlots, tos, language, gm} = loginInfo;

        if (!autoRegister) {

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

            if (LoginServer.instance.loginStore.has(preLoginClient.sessionId)) {
                encSession.write(LoginPackets.getLoginFailed(7)); // TODO: Verify this is the right login failed message
                return;
            }
        }

        const loginClient = {
            id: id,
            gender: gender,
            pin: pin,
            pic: pic,
            gm: gm,
            name: preLoginClient.username,
            sessionId: preLoginClient.sessionId
        } as LoginClient;

        LoginServer.instance.preLoginStore.delete(preLoginClient.sessionId);
        LoginServer.instance.loginStore.set(loginClient.sessionId, loginClient);
        encSession.write(LoginPackets.getAuthSuccess(loginClient));
    }

}