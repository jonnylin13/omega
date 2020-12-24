import { PacketReader } from "../../../protocol/packets/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Convert } from "../../../util/convert";
import { LoginServer } from "../loginServer";
import { Session } from "../../session";
import { LoginPackets } from "../loginPackets";


export class PreLoginPasswordHandler implements PacketHandler {
    async handlePacket(packet: PacketReader, session: Session): Promise<void> {

        const username = packet.readMapleAsciiString();
        const password = packet.readMapleAsciiString();
        packet.skip(6);
        const hwidBytes = packet.read(4);
        const hwidNibbles = new Convert.buffer(hwidBytes).toHexString();

        let preLoginClient;
        if (LoginServer.instance.preLoginStore.has(session.id)) {
            preLoginClient = LoginServer.instance.preLoginStore.get(session.id);
            preLoginClient.attempts++;

            if (preLoginClient.attempts > 3) {
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
        const username = packet.readMapleAsciiString();
        if (!found) {
            // Account not found
            // Get the session from preLoginStore - this could be reworked, kind of clunky but works for now
            for (let preLoginClient of LoginServer.instance.preLoginStore.values()) {
                if (preLoginClient.username === username) {
                    const encSession = LoginServer.instance.sessionStore.get(preLoginClient.sessionId);
                    encSession.write(LoginPackets.getLoginFailed(5));
                }
            }
            // Could not find encrypted session from username, so do nothing :/
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
    }
}