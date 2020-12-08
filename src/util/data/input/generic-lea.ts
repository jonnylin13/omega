import { Point } from '../../point';
import { LittleEndianAccessor } from './interface/lea';


export class GenericLittleEndianAccessor implements LittleEndianAccessor {

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

    read_char(): string {
        return String.fromCharCode(97 + this.read_short());
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

    read_ascii_string(length: number): string {
        let ret: Array<string> = [];
        for (let i = 0; i < length; i++) {
            ret.push(String.fromCharCode(97 + this.read_byte()));
        }
        return ret.join('');
    }

    read_terminated_ascii_string(): string {
        let ret: Array<string> = [];
        while (true) {
            let byte = this.read_byte();
            if (byte === 0) break;
            ret.push(String.fromCharCode(97 + byte));
        }
        return ret.join('');
    }

    read_maple_ascii_string(): string {
        return this.read_ascii_string(this.read_short());
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
    }

    available(): number {
        return this.buf.length - this.bytes_read;
    }

}