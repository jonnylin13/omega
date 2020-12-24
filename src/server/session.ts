import * as net from 'net';
import { AES } from '../protocol/crypto/aes';
import { Shanda } from '../protocol/crypto/shanda';


export class Session extends net.Socket {
    id: number;
}