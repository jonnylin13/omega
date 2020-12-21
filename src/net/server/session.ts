import * as net from 'net';
import { MapleClient } from '../../client/client';


export class Session extends net.Socket {
    id: string;
    nibble_hwid: string;
    client: MapleClient;
    in_transition: boolean;
}