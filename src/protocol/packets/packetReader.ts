import { Convert } from "../../util/convert";
import { Point } from "../../util/types/point";


export class PacketReader {

    data: Buffer;
    offset: number = 0;

    constructor(data: Buffer) {
        this.data = data;
    }

    readByte(): number {
        const byte = this.data.readIntLE(this.offset, 1);
        this.offset += 1;
        return byte;
    }

    readBoolean(): boolean {
        const bool = this.readByte();
        return bool === 1 ? true : false;
    }

    readUByte(): number {
        const uByte = this.data.readUIntLE(this.offset, 1);
        this.offset += 1;
        return uByte;
    }

    readShort(): number {
        const short = this.data.readInt16LE(this.offset);
        this.offset += 2;
        return short;
    }

    readUShort(): number {
        const uShort = this.data.readUInt16LE(this.offset);
        this.offset += 2;
        return uShort;
    }

    readChar(): string {
        return String.fromCharCode(97 + this.readShort());
    }

    readInt(): number {
        const int = this.data.readInt32LE(this.offset);
        this.offset += 4;
        return int;
    }

    readUInt(): number {
        const uInt = this.data.readUInt32LE(this.offset);
        this.offset += 4;
        return uInt;
    }

    readLong(): bigint {
        const long = this.data.readBigInt64LE(this.offset);
        this.offset += 8;
        return long;
    }

    readULong(): bigint {
        const uLong = this.data.readBigUInt64LE(this.offset);
        this.offset += 8;
        return uLong;
    }

    readDouble(): number {
        const double = this.data.readDoubleLE(this.offset);
        this.offset += 8;
        return double;
    }

    readAsciiString(length: number): string {
        const stringBuffer = Buffer.alloc(length);
        for (let i = 0; i < length; i++)
            stringBuffer[i] = this.readByte();
        return stringBuffer.toString('ascii');
    }

    readNullTerminatedAsciiString(): string {
        const stringArray = [];
        while (true) {
            const byte = this.readByte();
            if (byte === 0) break;
            stringArray.push(byte);
        }
        return Buffer.from(stringArray).toString('ascii');
    }

    readMapleAsciiString(): string {
        const length = this.readShort();
        return this.readAsciiString(length);
    }

    readPosition(): Point {
        const x = this.readShort();
        const y = this.readShort();
        return {x: x, y: y};
    }

    read(length: number): Buffer {
        const ret = Buffer.alloc(length);
        for (let i = 0; i < length; i++)
            ret[i] = this.readByte();
        return ret;
    }

    skip(length: number): void {
        this.offset += length;
    }

    seek(offset: number): void {
        this.offset = offset;
    }

    getRemainingPacket(): Buffer {
        return this.data.slice(this.offset);
    }


}