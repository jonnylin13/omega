import * as net from 'net';


export interface ServerHandler {
    on_data(session_id: string, data: Buffer): void;
    on_connection(socket: net.Socket): void;
    on_disconnect(session_id: string, had_error: any): void;
}