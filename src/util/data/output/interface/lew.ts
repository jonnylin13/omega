import { Point } from '../../../point';


export interface LittleEndianWriter {
    buf: Buffer;
    bytes_written: number;
    write(bytes: Int8Array): void;
    write_byte(byte: number): void;
    skip(length: number): void;
    write_int(int: number): void;
    write_short(short: number): void;
    write_long(long: bigint): void;
    write_ascii_string(str: string): void;
    write_terminated_ascii_string(str: string): void;
    write_maple_ascii_string(str: string): void;
    write_pos(pos: Point): void;
    write_bool(bool: boolean): void;
}