import { PacketReader } from "../../../protocol/packet/packetReader";
import { PacketHandler } from "../../baseHandler";
import { Convert } from "../../../util/convert";
import { LoginServer } from "../loginServer";
import { Session } from "../../session";
import { LoginPackets } from "../loginPackets";


export class PreLoginPasswordHandler implements PacketHandler {
    handlePacket(packet: PacketReader, session: Session): void {

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
            preLoginClient = {username: username, password: password, hwidNibbles: hwidNibbles, attempts: 1};
            LoginServer.instance.preLoginStore.set(session.id, preLoginClient);
        }

        // Send request to CenterServer to get account information
        LoginServer.instance.centerServerSession.write(LoginPackets.getPreLoginRequest(preLoginClient));
    }
}

export class PostLoginPasswordHandler implements PacketHandler {
    handlePacket(packet: PacketReader, session: Session): void {

    }
}