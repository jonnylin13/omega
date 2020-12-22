import * as net from 'net';
import { PacketDelegator } from '../packet-delegator';
import { Session } from '../server/session';


export enum ServerType {
    LOGIN, CHANNEL, CASH_SHOP
}

export interface ServerHandler {
    on_data(session: Session, data: Buffer): void;
    on_connection(socket: net.Socket): void;
    on_disconnect(session: Session, had_error: any): void;
    on_error(err: any): void;
    close_maple_session(session: Session): void;
    delegator: PacketDelegator;
    type: ServerType;
}