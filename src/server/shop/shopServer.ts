import * as net from 'net';
import { ServerType } from "../baseServer";
import { BaseServer } from "../baseServer";
import { PacketDelegator } from "../baseDelegator";
import { PacketReader } from "../../protocol/packets/packetReader";
import { ShopServerPacketDelegator } from "./shopServerDelegator";
import { Session } from "../session";


export class ShopServer extends BaseServer{

    centerServerSession: Session;
    connected: boolean = false;
    packetDelegator: PacketDelegator;
    static instance: ShopServer;

    constructor() {
        super(ServerType.SHOP, 8485);
        // Establish connection with CenterServer
        this.packetDelegator = new ShopServerPacketDelegator();
        this.centerServerSession = (net.connect({ port: 8483 }) as Session);
        this.centerServerSession.id = -1;
        this.centerServerSession.on('connect', () => this.onConnection(this.centerServerSession));
        this.centerServerSession.on('data', (data: Buffer) => this.onData(this.centerServerSession, data));
        this.centerServerSession.on('close', (hadError: boolean) => this.onClose(this.centerServerSession, hadError));
        this.centerServerSession.on('error', (error: any) => this.onError(error));
        ShopServer.instance = this;
    }

    isCenterServer(session: Session) {
        return this.centerServerSession.id === session.id;
    }

    isConnected(): boolean {
        return this.connected && (this.centerServerSession !== undefined);
    }

    onConnection(session: Session): void {
        // TODO: Authenticate with one-time generated key
        this.connected = true;
        this.logger.info(`ShopServer has established CenterServer connection`);
    }

    onClose(session: Session, hadError: any): void {
        if (this.isCenterServer(session)) {
            this.connected = false;
            delete this.centerServerSession;
        }
        // TODO: Retry connection ???
    }

    onData(session: Session, data: Buffer): void {

        const packet = new PacketReader(data);
        const opcode = packet.readShort();

        if (this.isCenterServer(session)) {

            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {

                this.logger.debug(`ShopServer unhandled packet 0x${opcode.toString(16)} from CenterServer`);
                return;
            }

            this.logger.debug(`ShopServer handling packet 0x${opcode.toString(16)} from CenterServer`);
            packetHandler.handlePacket(packet, this.centerServerSession);
        } else {
            // Potential malicious attack?
        }
    }

    onError(error: any): void {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        this.logger.info(`ShopServer has started listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}