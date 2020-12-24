import * as net from 'net';
import * as winston from 'winston';
import { ServerType, WINSTON_FORMAT } from "../baseServer";
import { BaseServer } from "../baseServer";
import { PacketDelegator } from "../baseDelegator";
import { PacketReader } from "../../protocol/packets/packetReader";
import { LoginServerPacketDelegator } from "./loginServerDelegator";
import { Session } from "../session";
import { Crypto } from '../../protocol/crypto/crypto';
import { AES } from '../../protocol/crypto/aes';
import { EncryptedSession } from '../../protocol/crypto/encryptedSession';
import { PreLoginClient } from './types/preLoginClient';
import { LoginPackets } from './loginPackets';
import { Shanda } from '../../protocol/crypto/shanda';


export class LoginServer extends BaseServer {

    static logger: winston.Logger = winston.createLogger({
        format: WINSTON_FORMAT,
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
            new winston.transports.Console({ level: 'debug' })
        ]
    });

    centerServerSession: Session;
    connected: boolean = false;
    packetDelegator: PacketDelegator;

    preLoginStore: Map<number, PreLoginClient> = new Map();
    sessionStore: Map<number, EncryptedSession> = new Map();

    static instance: LoginServer;

    constructor() {
        super(ServerType.LOGIN, 8484);
        // Establish connection with CenterServer
        this.packetDelegator = new LoginServerPacketDelegator();
        this.centerServerSession = (net.createConnection({ port: 8483 }) as Session);
        this.centerServerSession.id = -1; // Reserved session id for CenterServer
        LoginServer.instance = this;
    }

    isCenterServer(session: Session) {
        return this.centerServerSession.id === session.id;
    }

    isConnected(): boolean {
        return this.connected && (this.centerServerSession !== undefined);
    }

    onConnection(session: Session): void {
        if (this.isCenterServer(session)) {
            this.connected = true;
            LoginServer.logger.info(`LoginServer has established CenterServer connection`);
        } else {
            // MapleStory client connection
            LoginServer.logger.info(`LoginServer received a client connection from ${session.remoteAddress}`);
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
            // TODO: Retry connection ???
        } else {
            // Clear local stores
            if (this.preLoginStore.has(session.id)) this.preLoginStore.delete(session.id);
            if (this.sessionStore.has(session.id)) this.sessionStore.delete(session.id);
        }
    }

    onData(session: Session, data: Buffer): void {
        if (this.isCenterServer(session)) {
            const packet = new PacketReader(data);
            const opcode = packet.readShort();

            LoginServer.logger.debug(`LoginServer received packet 0x${opcode} from CenterServer`);

            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {
                LoginServer.logger.warn(`LoginServer unhandled packet from CenterServer 0x${opcode.toString(16)}`);
                return;
            }
            packetHandler.handlePacket(packet, session);
        } else {

            if (!this.sessionStore.has(session.id)) {
                // Never reached
                LoginServer.logger.warn(`LoginServer received a packet from ${session.remoteAddress} before session could be registered`);
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
                LoginServer.logger.warn(`Potential malicious attack to LoginServer from ${session.remoteAddress} packet id 0x${opcode.toString(16)}`);
                session.destroy();
                return;
            }
            
            LoginServer.logger.debug(`LoginServer received packet 0x${opcode.toString(16)} from ${session.remoteAddress}`);
            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {
                LoginServer.logger.warn(`LoginServer unhandled packet from client 0x${opcode.toString(16)}`);
                return;
            }
            LoginServer.logger.debug(`LoginServer processing packet 0x${opcode.toString(16)} from ${session.remoteAddress}`);
            packetHandler.handlePacket(packet, session);
        }
    }

    onError(error: any): void {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        LoginServer.logger.info(`LoginServer has started listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}