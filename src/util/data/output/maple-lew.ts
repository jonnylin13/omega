import { GenericLittleEndianWriter } from "./generic-lew";


export class MapleLittleEndianWriter extends GenericLittleEndianWriter {

    // Default size 32
    constructor(size=32) {
        super(Buffer.from(new Int8Array(size)));
    }

    get_packet() {
        return this.buf;
    }

}