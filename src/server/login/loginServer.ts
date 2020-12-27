import { ServerType } from "../baseServer";
import { PacketReader } from "../../protocol/packets/packetReader";
import { LoginServerPacketDelegator } from "./loginServerDelegator";
import { Session } from "../session";
import { Crypto } from '../../protocol/crypto/crypto';
import { AES } from '../../protocol/crypto/aes';
import { EncryptedSession } from '../../protocol/crypto/encryptedSession';
import { PreLoginClient } from './types/preLoginClient';
import { LoginPackets } from './loginPackets';
import { Shanda } from '../../protocol/crypto/shanda';
import { Config } from '../../util/config';
import { WorkerServer } from '../workerServer';
import { LoginClient } from "./types/loginClient";
import { isThisTypeNode, textChangeRangeIsUnchanged } from "typescript";


export class LoginServer extends WorkerServer {


    static instance: LoginServer;

    preLoginStore: Map<number, PreLoginClient> = new Map();
    loginStore: Map<number, LoginClient> = new Map();
    sessionStore: Map<number, EncryptedSession> = new Map();

    constructor() {
        super(ServerType.LOGIN, Config.instance.login.host, Config.instance.login.port);
        // Establish connection with CenterServer
        this.packetDelegator = new LoginServerPacketDelegator();
        LoginServer.instance = this;
    }

    onConnection(session: Session): void {
        if (this.isCenterServer(session)) {
            this.connected = true;
            this.logger.info(`LoginServer has established CenterServer connection`);
        } else {
            // MapleStory client connection
            this.logger.info(`LoginServer received a client connection: session ${session.id} @ ${session.remoteAddress}`);
            let ivRecv = Crypto.generateIv();
            let ivSend = Crypto.generateIv();
            const sendCypher = new AES(ivSend, 83);
            const recvCypher = new AES(ivRecv, 83);
            const encSession = new EncryptedSession(session, sendCypher, recvCypher);
            this.sessionStore.set(session.id, encSession);
            session.write(LoginPackets.getLoginHandshake(83, ivRecv, ivSend));
        }
    }

    onClose(session: Session, hadError: any): void {
        if (this.isCenterServer(session)) {
            this.connected = false;
            delete this.centerServerSession;
            this.logger.error(`LoginServer disconnected from CenterServer`);
            // TODO: Retry connection ???
        } else {
            // Clear local stores
            if (this.preLoginStore.has(session.id)) this.preLoginStore.delete(session.id);
            if (this.loginStore.has(session.id)) this.loginStore.delete(session.id);
            if (this.sessionStore.has(session.id)) this.sessionStore.delete(session.id);
            this.logger.info(`Session ${session.id} disconnected from LoginServer`);
        }
    }

    onData(session: Session, data: Buffer): void {
        if (this.isCenterServer(session)) {
            const packet = new PacketReader(data);
            const opcode = packet.readShort();

            const packetHandler = this.packetDelegator.getHandler(opcode);

            if (packetHandler === undefined) {
                this.logger.warn(`LoginServer unhandled packet 0x${opcode.toString(16)} from CenterServer`);
                return;
            }
            this.logger.debug(`LoginServer handling packet 0x${opcode.toString(16)} from CenterServer`);
            packetHandler.handlePacket(packet, session);
        } else {
            if (!this.sessionStore.has(session.id)) {
                // Never reached
                this.logger.warn(`LoginServer received a packet from ${session.remoteAddress} before session could be registered`);
                return;
            }

            // Validate header

            const encryptedSession = this.sessionStore.get(session.id);
            let dataNoHeader = data.slice(4); // Remove packet header
            encryptedSession.recvCrypto.transform(dataNoHeader);
            const decryptedData = Shanda.decrypt(dataNoHeader);
            const packet = new PacketReader(decryptedData);
            const opcode = packet.readShort();

            if (opcode >= 0x200) {
                this.logger.warn(`Potential malicious attack to LoginServer from ${session.remoteAddress} packet id 0x${opcode.toString(16)}`);
                session.destroy();
                return;
            }
            
            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {
                this.logger.warn(`LoginServer unhandled packet 0x${opcode.toString(16)} from client`);
                return;
            }
            this.logger.debug(`LoginServer handling packet 0x${opcode.toString(16)} from ${session.remoteAddress}`);
            packetHandler.handlePacket(packet, session);
        }
    }

    onError(error: any): void {
        this.logger.error(error.message);
    }

    onStart(): void {
        this.logger.info(`LoginServer has started listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}