import * as net from 'net';
import * as winston from 'winston';
import { ServerType, WINSTON_FORMAT } from "../baseServer";
import { BaseServer } from "../baseServer";
import { PacketDelegator } from "../baseDelegator";
import { PacketReader } from "../../protocol/packet/packetReader";
import { LoginServerPacketDelegator } from "./loginServerDelegator";
import { Session } from "../session";
import { Crypto } from '../../protocol/crypto/crypto';
import { AES } from '../../protocol/crypto/aes';
import { Client } from '../../game/client';
import { PreLoginClient } from './type/preLoginClient';


export class LoginServer extends BaseServer {

    static logger: winston.Logger = winston.createLogger({
        format: WINSTON_FORMAT,
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
            new winston.transports.Console({ level: 'debug' })
        ]
    });;

    centerServerSocket: net.Socket;
    connected: boolean = false;
    packetDelegator: PacketDelegator;
    preLoginStore: Map<number, PreLoginClient> = new Map();
    static instance: LoginServer;

    constructor() {
        super(ServerType.LOGIN, 8484);
        // Establish connection with CenterServer
        this.packetDelegator = new LoginServerPacketDelegator();
        this.centerServerSocket = net.createConnection({ port: 8483 });
        LoginServer.instance = this;
    }

    isCenterServerSocket(session: Session) {
        return this.centerServerSocket.remoteAddress === session.remoteAddress;
    }

    isConnected(): boolean {
        return this.connected && (this.centerServerSocket !== undefined);
    }

    onConnection(session: Session): void {
        this.connected = true;
        LoginServer.logger.info(`LoginServer has established CenterServer connection`);
    }

    onClose(session: Session, hadError: any): void {
        this.connected = false;
        delete this.centerServerSocket;
        // TODO: Retry connection ???
    }

    onData(session: Session, data: Buffer): void {
        const packet = new PacketReader(data);
        const opcode = packet.readShort();
        if (this.isCenterServerSocket(session)) {
            this.packetDelegator.getHandler(opcode).handlePacket(packet, session);
        } else {

            if (opcode >= 0x200) {
                LoginServer.logger.warn(`Potential malicious attack to LoginServer from ${session.remoteAddress}`);
                session.destroy();
                return;
            }
            // MapleStory client connection
            LoginServer.logger.info(`LoginServer received a client connection from ${session.remoteAddress}`);
            let ivRecv = Crypto.generateIv();
            let ivSend = Crypto.generateIv();
            const sendCypher = new AES(ivSend, 83);
            const recvCypher = new AES(ivRecv, 83);
            const client = new Client(sendCypher, recvCypher, session);
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