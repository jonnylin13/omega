import { ClientServer } from "../clientServer";
import { Session } from "../session";
import * as winston from 'winston';
import { Crypto } from "../../protocol/crypto/crypto";
import { AES } from "../../protocol/crypto/aes";
import { Client } from "../../game/client";
import * as net from 'net';
import { PacketDelegator } from "../baseDelegator";
import { BaseServer, ServerType, WINSTON_FORMAT } from "../baseServer";
import { CenterPackets } from "./centerPackets";
import { PacketReader } from "../../protocol/packet/packetReader";
import { CenterServerDelegator } from "./centerServerDelegator";


export class CenterServer extends ClientServer implements BaseServer {

    static logger: winston.Logger = winston.createLogger({
        format: WINSTON_FORMAT,
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
            new winston.transports.Console({ level: 'debug' })
        ]
    });

    loginServerSessionId: number;
    shopServerSessionId: number;

    packetDelegator: PacketDelegator;
    static instance: CenterServer;

    constructor(port: number = 8484) {
        super(ServerType.CENTER, port);
        CenterServer.instance = this;
        this.packetDelegator = new CenterServerDelegator();
    }

    private isWorker(session: Session): boolean {
        const addressInfo: net.AddressInfo | string = this.server.address();
        const thisAddress = typeof addressInfo === 'string' ? addressInfo : addressInfo.address;
        return thisAddress === session.remoteAddress;
    }

    onConnection(session: Session): void {
        if (this.isWorker(session)) {
            // WorkerServer connection
            // Send handshake to establish ServerType
            CenterServer.logger.info(`CenterServer received a worker connection from ${session.remoteAddress}`);
            session.write(CenterPackets.getWorkerHandshake());
        } else {
            // MapleStory client connection
            CenterServer.logger.info(`CenterServer received a client connection from ${session.remoteAddress}`);
            let ivRecv = Crypto.generateIv();
            let ivSend = Crypto.generateIv();
            const sendCypher = new AES(ivSend, 83);
            const recvCypher = new AES(ivRecv, 83);
            const client = new Client(sendCypher, recvCypher, session);
        }
    }

    onClose(session: Session, hadError: any): void {
        throw new Error("Method not implemented.");
    }

    onData(session: Session, data: Buffer): void {
        const packet = new PacketReader(data);
        const opcode = packet.readShort();

        if (opcode >= 0x200) {
            // WorkerServer packet

            if (!this.isWorker(session)) {
                session.destroy();
                CenterServer.logger.warn(`Potential malicious attack from ${session.remoteAddress}`);
                return;
            }

            this.packetDelegator.getHandler(opcode).handlePacket(packet, session);

        } else {

            // MapleStory client packet

        }
    }

    onError(error: any): void {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        CenterServer.logger.info(`CenterServer is listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}