import * as net from 'net';
import { AES } from '../protocol/crypto/aes';
import { Shanda } from '../protocol/crypto/shanda';
import { PacketReader } from '../protocol/packets/packetReader';


export class Session {
    id: number;
    socket: net.Socket;
    handling: Map<number, number> = new Map();

    constructor(socket: net.Socket) {
        this.socket = socket;
    }

    updateHandling(recvOp: number) {
        const numQueued = this.handling.get(recvOp);
        if (numQueued > 1) this.handling.set(recvOp, numQueued - 1);
        else this.handling.delete(recvOp);
    }

    isHandling(opcode: number) {
        return this.handling.has(opcode);
    }

    // TODO: Needs packet id (race condition) -- I.e. two clients logging in at the same time
    writePromise(data: Buffer, ackOpcode: number, recvCrypto?: AES, timeout: number = 10000): Promise<PacketReader> {
        this.socket.write(data);
        this.handling.set(ackOpcode, this.handling.has(ackOpcode) ? this.handling.get(ackOpcode) + 1 : 1);

        return new Promise((resolve, reject) => {

            const timeoutTask = setTimeout(() => {
                if (this.handling.has(ackOpcode)) {
                    this.handling.delete(ackOpcode);
                    reject(`Never recieved an ack packet with opcode 0x${ackOpcode.toString(16)}`);
                }
            }, timeout);

            const listener = (returnData: Buffer) => {
                const packet = new PacketReader(returnData);
                const opcode = packet.readShort();
                if (opcode == ackOpcode) {
                    this.socket.removeListener('data', listener);
                    this.updateHandling(ackOpcode);
                    clearInterval(timeoutTask);
                    resolve(packet);
                }
            };
            const encListener = (returnData: Buffer) => {
                let dataNoHeader = returnData.slice(4); // Remove packet header
                recvCrypto.transform(dataNoHeader);
                const decryptedData = Shanda.decrypt(dataNoHeader);
                const packet = new PacketReader(decryptedData);
                const opcode = packet.readShort();
                if (opcode == ackOpcode) {
                    this.socket.removeListener('data', encListener);
                    this.updateHandling(ackOpcode);
                    clearInterval(timeoutTask);
                    resolve(packet);
                }
            };
            if (!recvCrypto) {
                this.socket.on('data', listener);
            } else {
                this.socket.on('data', encListener);
            }
        });
        
    }
}