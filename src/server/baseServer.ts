import * as net from 'net';
import * as winston from 'winston';
import { Session } from './session';


export enum ServerType {
    CENTER, LOGIN, CHANNEL
}


export abstract class BaseServer {

    private port: number;
    private online: boolean = false;
    private type: ServerType;
    private server: net.Server;

    constructor(type: ServerType, port: number) {
        this.port = port;
        this.type = type;
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

    async start(): Promise<boolean> {
        if (this.isOnline()) return false;
        this.server = net.createServer();

    }

    abstract onConnection(socket: net.Socket): void;
    abstract onClose(session: Session, error: any): void;
    abstract onData(session: Session): void;
    abstract onError(error: any): void;

}