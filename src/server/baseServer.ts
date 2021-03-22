import * as net from 'net';
import { Session } from './session';
import * as winston from 'winston';
import { PacketDelegator } from './baseDelegator';
import { customFormat } from '../..';

export enum ServerType {
    CENTER, LOGIN, CHANNEL, SHOP
}


export abstract class BaseServer {

    loggerFormat: winston.Logform.Format;
    logger: winston.Logger;
    protected port: number;
    protected host: string;
    private online: boolean = false;
    protected type: ServerType;
    protected server: net.Server;
    private _nextSessionId: number = 0;
    protected packetDelegator: PacketDelegator;
    protected availableSessionIds: Array<number> = [];

    constructor(type: ServerType, host: string, port: number) {
        this.port = port;
        this.type = type;
        this.host = host;
        this.loggerFormat = winston.format.combine(
            winston.format.label({ label: ServerType[this.type] }),
            winston.format.colorize(),
            customFormat
        );
        this.logger = winston.createLogger({
            format: this.loggerFormat,
            transports: [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
                new winston.transports.Console({ level: 'debug' })
            ]
        });
        this.start();
    }

    getPort(): number {
        return this.port;
    }

    getType(): ServerType {
        return this.type;
    }

    isOnline(): boolean {
        return this.online;
    }

    private getNextSessionId() {
        if (this.availableSessionIds.length > 0) return this.availableSessionIds.shift();
        return this._nextSessionId++;
    }

    async start(): Promise<boolean> {
        if (this.isOnline()) return false;
        this.server = net.createServer();
        this.server.on('connection', (socket) => {
            this.onConnection(this.setupConnection(socket));

        });
        this.online = true;
        this.server.listen(this.port, this.host);
        this.onStart();
        return true;
    }

    async shutdown(): Promise<boolean> {
        if (!this.isOnline()) return false;
        this.server.close();
        delete this.server;
        this.online = false;
        this.onShutdown();
        return true;
    }

    setupConnection(socket: net.Socket): Session {
        const session = new Session(socket);
        session.id = this.getNextSessionId();
        socket.on('close', (hadError) => {
            this.onClose(session, hadError);
            this.availableSessionIds.push(session.id);
        });
        socket.on('data', (data) => this.onData(session, data));
        socket.on('error', (error) => this.onError(error));
        socket.setNoDelay(true); // Disable Nagle's algorithm
        return session;
    }

    abstract onConnection(session: Session): void;
    abstract onClose(session: Session, hadError: any): void;
    abstract onData(session: Session, data: Buffer): void;
    abstract onError(error: any): void;
    abstract onStart(): void;
    abstract onShutdown(): void;

}