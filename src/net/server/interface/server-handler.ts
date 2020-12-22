import * as net from 'net';
import { Session } from '../session';


export interface ServerHandler {
    on_data(session: Session, data: Buffer): void;
    on_connection(socket: net.Socket): void;
    on_disconnect(session: Session, had_error: any): void;
}