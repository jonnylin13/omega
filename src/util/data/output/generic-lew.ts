import { LittleEndianWriter } from "./interface/lew";
import { Point } from '../../point';


export class GenericLittleEndianWriter implements LittleEndianWriter {
    buf: Buffer;
    bytes_written: number = 0;

    constructor(buf: Buffer) {
        this.buf = buf;
    }

    private check_needs_expansion() {
        // Allocate more space
        if (this.bytes_written === this.buf.length)
            this.buf = Buffer.alloc(this.buf.length + 32, this.buf);
    }

    write_byte(byte: number): void {
        this.check_needs_expansion();
        this.bytes_written += 1;
        this.buf.writeIntLE(byte, this.bytes_written - 1, 1);
    }

    skip(length: number): void {
        this.write(new Int8Array(length));
    }

    write_short(short: number): void {
        this.check_needs_expansion();
        this.bytes_written += 2;
        this.buf.writeInt16LE(short, this.bytes_written - 2);
    }

    write_int(int: number): void {
        this.check_needs_expansion();
        this.bytes_written += 4;
        this.buf.writeInt32LE(int, this.bytes_written - 4);
    }

    write_long(long: bigint): void {
        this.check_needs_expansion();
        this.bytes_written += 8;
        this.buf.writeBigInt64LE(long, this.bytes_written - 8);
    }

    write(bytes: Int8Array): void {
        for (let byte of bytes) this.write_byte(byte);
    }

    write_buffer(buf: Buffer): void {
        for (let byte of buf) this.write_byte(byte);
    }

    write_ascii_string(str: string): void {
        this.write_buffer(Buffer.from(str, 'utf-8'));
    }

    write_maple_ascii_string(str: string): void {
        this.write_short(str.length);
        this.write_ascii_string(str);
    }

    write_terminated_ascii_string(str: string): void {
        this.write_ascii_string(str);
        this.write_byte(0);
    }

    write_pos(pos: Point): void {
        this.write_short(pos.x);
        this.write_short(pos.y);
    }

    write_bool(bool: boolean): void {
        this.write_byte(bool ? 1 : 0);
    }

}