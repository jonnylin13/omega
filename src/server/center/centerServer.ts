import { Session } from "../session";
import { PacketDelegator } from "../baseDelegator";
import { BaseServer, ServerType } from "../baseServer";
import { CenterPackets } from "./centerPackets";
import { PacketReader } from "../../protocol/packets/packetReader";
import { CenterServerDelegator } from "./centerServerDelegator";
import * as prometheus from 'prom-client';
import * as process from 'process';
import { Config } from "../../util/config";
import { CenterSendOpcode } from "../../protocol/opcodes/center/send";
import { CommonSendOpcode } from "../../protocol/opcodes/common/send";

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


    loginServerSessionId: number;
    shopServerSessionId: number;
    workerSessionStore: Set<number> = new Set();
    loginStore: Set<number> = new Set();

    packetDelegator: PacketDelegator;
    static instance: CenterServer;

    constructor() {
        super(ServerType.CENTER, Config.instance.center.host, Config.instance.center.port);
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
        this.logger.info(`CenterServer received a worker connection from ${session.socket.remoteAddress}`);
        this.workerSessionStore.add(session.id);
        session.socket.write(CenterPackets.getWorkerHandshake());
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
                this.logger.warn(`Potential malicious attack to CenterServer from ${session.socket.remoteAddress}`);
                session.socket.destroy();
                return;
            }
            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined && !session.isHandling(opcode)) {
                this.logger.warn(`CenterServer unhandled packet 0x${opcode.toString(16)} from ${session.socket.remoteAddress}`);
                return;
            }

            if (packetHandler !== undefined) {
                this.logger.debug(`CenterServer handling packet 0x${opcode.toString(16)} from ${session.socket.remoteAddress}`);
                packetHandler.handlePacket(packet, session);
            }

        }
    }

    onError(error: any): void {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        this.logger.info(`CenterServer is listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}