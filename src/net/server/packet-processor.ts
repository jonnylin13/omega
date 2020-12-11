import { RecvOpcode } from '../opcodes/recv';


export class PacketProcessor {

    static instance: Map<string, PacketProcessor> = new Map();
    // private handlers: Array<MaplePacketHandler> = [];

    constructor() {
        let max_recv_op = 0;
        for (let op of Object.values(RecvOpcode)) {
            console.log(op);
        }
    }

}