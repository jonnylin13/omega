import { expect } from 'chai';
import { it, describe } from 'mocha';
import { PacketReader } from '../../../src/protocol/packets/packetReader';

describe('protocol/packets/packetReader.ts', () => {

    it('should read a byte', () => {
        expect(new PacketReader(Buffer.from([0x02])).readByte()).to.equal(2);
    });

    it('should read booleans', () => {
        const packet = new PacketReader(Buffer.from([0x01, 0x00]));
        expect(packet.readBoolean()).to.equal(true);
        expect(packet.readBoolean()).to.equal(false);
    });

    it('should read a short', () => {
        const short = Buffer.alloc(2);
        short.writeInt16LE(2);
        expect(new PacketReader(short).readShort()).to.equal(2);
    });

    it('should read a char', () => {
        expect(new PacketReader(Buffer.from([0x0, 0x0])).readChar()).to.equal('a');
    });

    it('should read a int', () => {
        const int = Buffer.alloc(4);
        int.writeInt32LE(5);
        expect(new PacketReader(int).readInt()).to.equal(5);
    });

    it('should read a long', () => {
        const long = Buffer.alloc(8);
        long.writeBigInt64LE(BigInt(999999));
        expect(new PacketReader(long).readLong()).to.equal(BigInt(999999));
    });

    it('should read a double', () => {
        const double = Buffer.alloc(8);
        double.writeDoubleLE(0.2);
        expect(new PacketReader(double).readDouble()).to.equal(0.2);
    });

    it('should read an ascii string', () => {
        const string = Buffer.from([0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x74, 0x65, 0x73, 0x74, 0x20, 0x73, 0x74, 0x72, 0x69, 0x6e, 0x67]);
        expect(new PacketReader(string).readAsciiString(21)).to.equal('this is a test string');
    });

    it('should read a null terminated ascii string', () => {
        const string = Buffer.from([0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x74, 0x65, 0x73, 0x74, 0x20, 0x73, 0x74, 0x72, 0x69, 0x6e, 0x67, 0]);
        expect(new PacketReader(string).readNullTerminatedAsciiString()).to.equal('this is a test string');
    });

    it('should read a maple ascii string', () => {
        const string = Buffer.from([0x15, 0x0, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x74, 0x65, 0x73, 0x74, 0x20, 0x73, 0x74, 0x72, 0x69, 0x6e, 0x67]);
        expect(new PacketReader(string).readMapleAsciiString()).to.equal('this is a test string');
    });

    it('should read a position', () => {
        const pos = Buffer.from([0x0, 0x1, 0x10, 0x00]);
        const readPos = new PacketReader(pos).readPosition();
        expect(readPos.x).to.equal(256);
        expect(readPos.y).to.equal(16);
    });

    it('should read a number of bytes', () => {
        const result = new PacketReader(Buffer.from([0x0, 0x01, 0x02, 0x03]));
        expect(result.read(4).reduce((a, b) => a + b)).to.equal(6);
    });

    it('should skip a number of bytes', () => {
        const result = new PacketReader(Buffer.from([0, 0x01, 0x02, 0x03]));
        result.skip(2);
        expect(result.readByte()).to.equal(0x02);
    });

    it('should set the offset to a certain number', () => {
        const result = new PacketReader(Buffer.from([0, 0x01, 0x02, 0x03]));
        result.seek(2);
        expect(result.readByte()).to.equal(0x02);
    });

    it('should return the remaining buffer', () => {
        const result = new PacketReader(Buffer.from([0xff, 0x01, 0x02, 0x03]));
        result.readByte();
        expect(result.getRemainingPacket().reduce((a, b) => a + b)).to.equal(6);
    });

});