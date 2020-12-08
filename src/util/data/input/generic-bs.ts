import { ByteInputStream } from './interface/bs';


// This bytestream can only read forward
export class GenericByteInputStream implements ByteInputStream {
    buf: Buffer;
    bytes_read: number = 0;

    constructor(buf: Buffer) {
        this.buf = buf;
    }

    read_byte(): number {
        this.bytes_read += 1;
        return this.buf.readIntLE(this.bytes_read-1, 1);
    }

    read_short(): number {
        this.bytes_read += 2;
        return this.buf.readInt16LE(this.bytes_read-2);
    }

    read_int(): number {
        this.bytes_read += 4;
        return this.buf.readInt32LE(this.bytes_read-4);
    }

    read_float(): number {
        this.bytes_read += 4;
        return this.buf.readFloatLE(this.bytes_read-4);
    }

    read_long(): BigInt {
        this.bytes_read += 8;
        return this.buf.readBigInt64LE(this.bytes_read-8);
    }

    read_double(): number {
        this.bytes_read += 8;
        return this.buf.readDoubleLE(this.bytes_read-8);
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
    }

    available(): number {
        return this.buf.length - this.bytes_read
    }
}