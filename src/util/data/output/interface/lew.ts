import { Point } from '../../../point';


export interface LittleEndianWriter {
    write(arr: Int8Array): void;
    write(byte: number): void;
    skip(length: number): void;
    write_int(int: number): void;
    write_short(short: number): void;
    write_long(long: number): void;
    write_ascii_string(str: string): void;
    write_terminated_string(str: string): void;
    write_maple_ascii_string(str: string): void;
    write_pos(pos: Point): void;
    write_bool(bool: boolean): void;
}