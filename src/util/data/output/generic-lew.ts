import { LittleEndianWriter } from "./interface/lew";
import { Point } from '../../point';


export class GenericLittleEndianWriter implements LittleEndianWriter {
    buf: Buffer;
    bytes_written: number;

    constructor(buf: Buffer) {
        this.buf = buf;
    }

    write(bytes: Int8Array): void {
        for (let byte of bytes) this.write_byte(byte);
    }

    write_byte(byte: number): void {
        this.buf.writeIntLE(byte, 0, 1);
    }

    skip(length: number): void {
        this.write(new Int8Array(length));
    }

    write_short(short: number): void {
        this.buf.writeInt16LE(short);
    }

    write_int(int: number): void {
        this.buf.writeInt32LE(int);
    }

    write_long(long: bigint): void {
        this.buf.writeBigInt64LE(long);
    }

    write_ascii_string(str: string): void {
        // TODO: Validate function, then validate charset
        this.write(new Int8Array(Buffer.from(str)));
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