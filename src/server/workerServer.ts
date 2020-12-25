import { BaseServer, ServerType } from "./baseServer";
import { Session } from "./session";
import * as net from 'net';
import { Config } from "../util/config";


export abstract class WorkerServer extends BaseServer {

    centerServerSession: Session;
    protected connected: boolean;

    constructor(type: ServerType, host: string, port: number) {
        super(type, host, port)
        this.centerServerSession = (net.connect({ port: Config.instance.center.port }) as Session);
        this.centerServerSession.id = -1;
        this.centerServerSession.setKeepAlive(true);
        this.centerServerSession.on('connect', () => this.onConnection(this.centerServerSession));
        this.centerServerSession.on('data', (data: Buffer) => this.onData(this.centerServerSession, data));
        this.centerServerSession.on('close', (hadError: boolean) => this.onClose(this.centerServerSession, hadError));
        this.centerServerSession.on('error', (err: any) => this.onError(err));
    }

    isCenterServer(session: Session) {
        return this.centerServerSession.id === session.id;
    }

    isConnected(): boolean {
        return this.connected && (this.centerServerSession !== undefined);
    }

}