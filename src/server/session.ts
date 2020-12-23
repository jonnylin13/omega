import * as net from 'net';
import { Client } from '../game/client';


export class Session extends net.Socket {
    id: number;
    client: Client;
}