import { expect } from 'chai';
import { it, describe } from 'mocha';
import { PacketReader } from '../../src/protocol/packets/packetReader';


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

    // TODO: Test string functions, read(), skip(), seek(), getRemainingPacket()

});