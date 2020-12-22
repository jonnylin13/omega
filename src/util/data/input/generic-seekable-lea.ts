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
        const ret = this.buf.readIntLE(this.pos, 1);
        this.bytes_read += 1;
        this.pos += 1;
        return ret;
    }

    read_short(): number {
        const ret = this.buf.readInt16LE(this.pos);
        this.bytes_read += 2;
        this.pos += 2;
        return ret;
    }

    read_char(): string {
        return String.fromCharCode(97 + this.read_short());
    }

    read_int(): number {
        const ret = this.buf.readInt32LE(this.pos);
        this.bytes_read += 4;
        this.pos += 4;
        return ret;
    }

    read_float(): number {
        const ret = this.buf.readFloatLE(this.pos);
        this.bytes_read += 4;
        this.pos += 4;
        return ret;
    }

    read_long(): bigint {
        const ret = this.buf.readBigInt64LE(this.pos);
        this.bytes_read += 8;
        this.pos += 8;
        return ret;
    }

    read_double(): number {
        const ret = this.buf.readDoubleLE(this.pos);
        this.bytes_read += 8;
        this.pos += 8;
        return ret;
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