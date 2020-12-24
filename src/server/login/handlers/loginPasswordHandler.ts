import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Convert } from "../../../util/convert";
import { LoginServer } from "../loginServer";
import { Session } from "../../session";
import { LoginPackets } from "../loginPackets";
import * as bcrypt from 'bcrypt';


export class PreLoginPasswordHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {

        const username = packet.readMapleAsciiString();
        const password = packet.readMapleAsciiString();
        packet.skip(6);
        const hwidBytes = packet.read(4);
        const hwidNibbles = hwidBytes.toString('hex');

        let preLoginClient;
        if (LoginServer.instance.preLoginStore.has(session.id)) {
            preLoginClient = LoginServer.instance.preLoginStore.get(session.id);
            preLoginClient.attempts++;

            if (preLoginClient.attempts > 3) {
                // TODO: Do something else here lol
                LoginServer.instance.preLoginStore.delete(session.id);
                session.destroy();
                return;
            }
        } else {
            preLoginClient = {username: username, password: password, hwidNibbles: hwidNibbles, attempts: 1, sessionId: session.id};
            LoginServer.instance.preLoginStore.set(session.id, preLoginClient);
        }

        // Send request to CenterServer to get account information
        LoginServer.instance.centerServerSession.write(LoginPackets.getPreLoginRequest(preLoginClient));
    }
}

export class PreLoginPasswordAckHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {

        const found = packet.readBoolean();
        const sessionId = packet.readInt();
        const username = packet.readMapleAsciiString();
        const preLoginClient = LoginServer.instance.preLoginStore.get(sessionId);
        const encSession = LoginServer.instance.sessionStore.get(sessionId);

        if (!preLoginClient || !encSession) {
            LoginServer.logger.warn(`Could not fetch preLoginClient or encryptedSession from LoginServer stores`);
            return; // Something went wrong
        }

        if (!found) {
            // Account not found
            LoginServer.logger.debug(`Username ${username} not found when attempting login`);
            encSession.write(LoginPackets.getLoginFailed(5));
            return;
        }

        // Parse the information
        // TODO: Check if all these fields are necessary
        const id = packet.readInt();
        const hashedPassword = packet.readMapleAsciiString();
        const gender = packet.readByte();
        const banned = packet.readBoolean();
        const pin = packet.readMapleAsciiString();
        const pic = packet.readMapleAsciiString();
        const character_slots = packet.readByte();
        const tos = packet.readBoolean();
        const language = packet.readByte();

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