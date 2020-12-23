import * as net from 'net';


export interface WorkerServer {
    centerServerSocket: net.Socket;
    connected: boolean;
    onCenterServerConnection(socket: net.Socket): void;
    onCenterServerData(data: any): void;
    onCenterServerError(err: any): void;
    onCenterServerClose(hadError: boolean): void;
    isConnected(): boolean;
}