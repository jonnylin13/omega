import { SeekableInputByteStream } from './interface/seekable-bs';
import { GenericByteInputStream } from './generic-bs';


export class GenericSeekableByteStream extends GenericByteInputStream implements SeekableInputByteStream {
    pos: number = 0;
    arr: Int8Array;
    buf: Buffer;

    constructor(arr: Int8Array) {
        super(Buffer.from(arr.buffer));
        this.arr = arr;
    }

    seek(offset: number) {
        this.pos = offset;
    }

    read_byte(): number {
        this.bytes_read += 1;
        this.pos += 1;
        return this.buf.readIntLE(this.pos-1, 1);
    }

    read_short(): number {
        this.bytes_read += 2;
        this.pos += 2;
        return this.buf.readInt16LE(this.pos-2);
    }

    read_int(): number {
        this.bytes_read += 4;
        this.pos += 4;
        return this.buf.readInt32LE(this.pos-4);
    }

    read_float(): number {
        this.bytes_read += 4;
        this.pos += 4;
        return this.buf.readFloatLE(this.pos-4);
    }

    read_long(): BigInt {
        this.bytes_read += 8;
        this.pos += 8;
        return this.buf.readBigInt64LE(this.pos-8);
    }

    read_double(): number {
        this.bytes_read += 8;
        this.pos += 8;
        return this.buf.readDoubleLE(this.pos-8);
    }

    read(length: number): Int8Array {
        let ret: Int8Array = new Int8Array(length);
        for (let i = 0; i < length; i++) {
            ret[i] = this.read_byte();
        }
        return ret;
    }

    skip(length: number): void {
        this.bytes_read += length;
        this.pos += length;
    }


}