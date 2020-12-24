import { Session } from "../session";
import * as winston from 'winston';
import { PacketDelegator } from "../baseDelegator";
import { BaseServer, ServerType, WINSTON_FORMAT } from "../baseServer";
import { CenterPackets } from "./centerPackets";
import { PacketReader } from "../../protocol/packets/packetReader";
import { CenterServerDelegator } from "./centerServerDelegator";
import * as prometheus from 'prom-client';
import * as process from 'process';

const requestCounter = new prometheus.Counter({
    name: 'center_request_counter',
    help: 'Number of requests to CenterServer'
});

const memGauge = new prometheus.Gauge({
    name: 'center_memory_gauge',
    help: 'CenterServer heap used',
    labelNames: ['ServerType']
});

setInterval(() => {
    const memUsed = process.memoryUsage();
    memGauge.set({ServerType: 'CENTER'}, Math.round(memUsed.heapUsed / 1024 / 1024 * 100) / 100);
}, 15000);

export class CenterServer extends BaseServer {

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
    workerSessionStore: Set<number> = new Set();

    packetDelegator: PacketDelegator;
    static instance: CenterServer;

    constructor(port: number = 8483) {
        super(ServerType.CENTER, port);
        CenterServer.instance = this;
        this.packetDelegator = new CenterServerDelegator();
    }

    // Temporary, needs rewrite with token authentication instead
    private isWorker(session: Session): boolean {
        return this.workerSessionStore.has(session.id);
    }

    onConnection(session: Session): void {
        // WorkerServer connection
        // Send handshake to establish ServerType
        CenterServer.logger.info(`CenterServer received a worker connection from ${session.remoteAddress}`);
        this.workerSessionStore.add(session.id);
        session.write(CenterPackets.getWorkerHandshake());
    }

    onClose(session: Session, hadError: any): void {
        if (this.isWorker(session)) {
            this.workerSessionStore.delete(session.id);
        }
    }

    onData(session: Session, data: Buffer): void {
        const packet = new PacketReader(data);
        const opcode = packet.readShort();
        requestCounter.inc(1);

        if (opcode >= 0x200) {
            // WorkerServer packet

            if (!this.isWorker(session)) {
                CenterServer.logger.warn(`Potential malicious attack to CenterServer from ${session.remoteAddress}`);
                session.destroy();
                return;
            }
            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {
                CenterServer.logger.warn(`CenterServer unhandled packet id 0x${opcode.toString(16)} from ${session.remoteAddress}`);
                return;
            }
            CenterServer.logger.debug(`CenterServer handling packet id 0x${opcode.toString(16)} from ${session.remoteAddress}`);
            packetHandler.handlePacket(packet, session);

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