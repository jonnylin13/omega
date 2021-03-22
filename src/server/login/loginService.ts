import { EncryptedSession } from "../../protocol/crypto/encryptedSession";
import { PacketReader } from "../../protocol/packets/packetReader";
import { LoginPackets } from "./loginPackets";
import { PreLoginClient } from "./types/preLoginClient";
import * as bcrypt from 'bcrypt';
import { LoginServer } from "./loginServer";
import { LoginClient } from "./types/loginClient";
import { CommonPackets } from "../commonPackets";


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

        return {id, hashedPassword, gender, banned, pin, pic, characterSlots, tos, language};
    }

    private static async loginOk(preLoginClient: PreLoginClient, loginInfo: any): Promise<number> {

        // TODO: Check if ip banned, mac banned, or temp banned
        if (loginInfo.banned) return 3;

        // TODO: Check multiclient

        // Compare password
        const passwordCorrect = await bcrypt.compare(preLoginClient.password, loginInfo.hashedPassword);
        if (!passwordCorrect) {
            // Wrong password
            LoginServer.instance.logger.debug(`User ${preLoginClient.username} failed password check`);
            return 4;
        }


        if (!loginInfo.tos) {
            LoginServer.instance.logger.debug(`Sending EULA to user ${preLoginClient.username}`);
            return 23;
        }

        if (LoginServer.instance.loginStore.has(preLoginClient.sessionId)) {
            LoginServer.instance.logger.warn(`User ${preLoginClient.username} tried to login when already in login store`);
            return 7; // TODO: Make sure this is correct reason code
        }

        return 0;
    }

    static async login(preLoginClient: PreLoginClient, encSession: EncryptedSession, loginInfo: any, autoRegister: boolean = false) {

        const {id, hashedPassword, gender, banned, pin, pic, characterSlots, tos, language} = loginInfo;

        if (!autoRegister) {

            const loginOk = await LoginService.loginOk(preLoginClient, loginInfo);

            // TODO: Move logic to loginOk

            if (loginOk !== 0) {
                await encSession.write(LoginPackets.getLoginFailed(loginOk));
                return;
            }
        }

        const loginClient = {
            id: id,
            gender: gender,
            pin: pin,
            pic: pic,
            name: preLoginClient.username,
            sessionId: preLoginClient.sessionId
        } as LoginClient;

        LoginServer.instance.preLoginStore.delete(preLoginClient.sessionId);
        LoginServer.instance.loginStore.set(loginClient.sessionId, loginClient);
        
        LoginServer.instance.logger.debug(`Logging in username ${preLoginClient.username}`);

        await encSession.write(LoginPackets.getAuthSuccess(loginClient));
    }

}