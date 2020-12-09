import { SeekableLittleEndianAccessor } from './interface/seekable-lea';
import { GenericLittleEndianAccessor } from './generic-lea';
import { Point } from '../../point';
import { Convert } from '../../convert';


export class GenericSeekableLittleEndianAccessor extends GenericLittleEndianAccessor implements SeekableLittleEndianAccessor {
    pos: number = 0;

    constructor(buf: Buffer) {
        super(buf);
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

    read_char(): string {
        return String.fromCharCode(97 + this.read_short());
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

    read_ascii_string(length: number): string {
        let ret: Int8Array = new Int8Array(length);
        for (let i = 0; i < length; i++) 
            ret[i] = this.read_byte();
        return Convert.buf_to_string(ret);
    }

    read_terminated_ascii_string(): string {
        let arr = [];
        while (true) {
            let byte = this.read_byte();
            if (byte === 0) break;
            arr.push(byte);
        }
        return Convert.buf_to_string(Int8Array.from(arr));
    }

    read_maple_ascii_string(): string {
        let length = this.read_short();
        return this.read_ascii_string(length);
    }

    read_pos(): Point {
        let x = this.read_short();
        let y = this.read_short();
        return new Point(x, y);
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

    seek(offset: number) {
        this.pos = offset;
    }


}