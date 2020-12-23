import * as net from 'net';
import { Session } from './session';
import * as winston from 'winston';
import { ServerType } from './baseServer';


export abstract class ClientServer {

    protected port: number;
    private online: boolean = false;
    protected type: ServerType;
    protected server: net.Server;
    private _nextSessionId: number = 0;

    constructor(type: ServerType, port: number) {
        this.port = port;
        this.type = type;
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
        return this._nextSessionId++;
    }

    async start(): Promise<boolean> {
        if (this.isOnline()) return false;
        this.server = net.createServer();
        this.server.on('connection', (socket) => {
            this.onConnection(this.setupConnection(socket));

        });
        this.online = true;
        this.server.listen(this.port, '127.0.0.1');
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
        const session = (socket as Session);
        session.id = this.getNextSessionId();
        socket.on('close', (hadError) => this.onClose(session, hadError));
        socket.on('data', (data) => this.onData(session, data));
        socket.on('error', (error) => this.onError(error));
        return session;
    }

    abstract onConnection(session: Session): void;
    abstract onClose(session: Session, hadError: any): void;
    abstract onData(session: Session, data: Buffer): void;
    abstract onError(error: any): void;
    abstract onStart(): void;
    abstract onShutdown(): void;

}