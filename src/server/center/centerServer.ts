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


export class CenterServer extends ClientServer implements BaseServer {

    static logger: winston.Logger = winston.createLogger({
        format: WINSTON_FORMAT,
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
            new winston.transports.Console({ level: 'debug' })
        ]
    });;

    private ready: boolean = false;
    private loginServerId: number;
    packetDelegator: PacketDelegator;

    constructor(port: number = 8484) {
        super(ServerType.CENTER, port);
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
            session.write(CenterPackets.getLoginHandshake());
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
        if (this.isWorker(session)) {
            console.log(data);
        } else {
            
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