import { Point } from '../../../point';
import { ByteInputStream } from './bs';


export interface LittleEndianAccessor {
    is: ByteInputStream
    read_byte(): number;
    read_char(): string;
    read_short(): number;
    read_int(): number;
    read_pos(): Point;
    read_long(): BigInt;
    skip(length: number): void;
    read(length: number): Int8Array;
    read_float(): number;
    read_double(): number;
    read_ascii_string(length: number): string;
    read_terminated_ascii_string(): string;
    read_maple_ascii_string(): string;
}