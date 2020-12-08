

export interface ByteInputStream {
    buf: Buffer;
    bytes_read: number;
    available(): number;
    read_byte(): number;
    read_short(): number;
    read_int(): number;
    read_long(): BigInt;
    skip(length: number): void;
    read(length: number): Int8Array;
    read_float(): number;
    read_double(): number;
}