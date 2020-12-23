import { WorkerServer } from "../workerServer";
import * as net from 'net';
import * as winston from 'winston';
import { WINSTON_FORMAT } from "../baseServer";
import { BaseServer } from "../baseServer";
import { PacketDelegator } from "../baseDelegator";
import { PacketReader } from "../../protocol/packet/packetReader";
import { LoginServerPacketDelegator } from "./loginServerDelegator";


export class LoginServer implements WorkerServer, BaseServer {

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

    constructor() {
        // Establish connection with CenterServer
        this.packetDelegator = new LoginServerPacketDelegator();
        this.centerServerSocket = net.createConnection({ port: 8484 }, () => this.onCenterServerConnection());
        this.centerServerSocket.on('data', (data) => this.onCenterServerData(data));
        this.centerServerSocket.on('close', (hadError) => this.onCenterServerClose(hadError));
        this.centerServerSocket.on('error', (error) => this.onCenterServerError(error));
    }

    onCenterServerConnection(): void {
        this.connected = true;
        LoginServer.logger.info(`LoginServer has established CenterServer connection`);
    }

    onCenterServerData(data: any): void {
        const packet = new PacketReader(data);
        const opcode = packet.readShort();
        this.packetDelegator.getHandler(opcode).handlePacket(packet, this.centerServerSocket);
    }

    onCenterServerClose(hadError: boolean): void {
        this.connected = false;
        delete this.centerServerSocket;
        // TODO: Retry connection ???
    }

    onCenterServerError(err: any): void {
        throw new Error("Method not implemented.");
    }

    isConnected(): boolean {
        return this.connected && (this.centerServerSocket !== undefined);
    }

}