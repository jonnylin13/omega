import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { MapleCustomEncryption } from '../../src/net/mina/crypto';
import { Compare } from '../../src/util/compare';


// Should we be using Int8Array here?
const test_bytes: Buffer = Buffer.from([0xe0, 0x4f, 0xd0,
    0x20, 0xea, 0x3a, 0x69, 0x10, 0xa2, 0xd8, 0x08, 0x00, 0x2b,
    0x30, 0x30, 0x9d ]);
const test_answer: Buffer = Buffer.from([
    12, -95,   76,   9, -38,
    57, 106,  -22, -21, -62,
   126, 103, -110,  70,  84,
    44
 ]);
const decrypted_answer: Buffer = Buffer.from([
    -32, 79, -48,  32, -22, 58,
    105, 16, -94, -40,   8,  0,
     43, 48,  48, -99
  ]);

describe('MapleCustomEncryption test', () => {
    it('test roll_left()', () => {
        expect(MapleCustomEncryption.roll_left(0xFF, 3)).equal(-1);
        expect(MapleCustomEncryption.roll_left(0x00, 3)).equal(0);
        expect(MapleCustomEncryption.roll_left(0x01, 3)).equal(8);
        expect(MapleCustomEncryption.roll_left(0x80, 3)).equal(4);

        expect(MapleCustomEncryption.roll_left(0xFF, 4)).equal(-1);
        expect(MapleCustomEncryption.roll_left(0x00, 4)).equal(0);
        expect(MapleCustomEncryption.roll_left(0x01, 4)).equal(16);
        expect(MapleCustomEncryption.roll_left(0x80, 4)).equal(8);
    });

    it('test roll_right()', () => {
        expect(MapleCustomEncryption.roll_right(0xFF, 3)).equal(-1);
        expect(MapleCustomEncryption.roll_right(0x00, 3)).equal(0);
        expect(MapleCustomEncryption.roll_right(0x01, 3)).equal(32);
        expect(MapleCustomEncryption.roll_right(0x80, 3)).equal(16);

        expect(MapleCustomEncryption.roll_right(0xFF, 4)).equal(-1);
        expect(MapleCustomEncryption.roll_right(0x00, 4)).equal(0);
        expect(MapleCustomEncryption.roll_right(0x01, 4)).equal(16);
        expect(MapleCustomEncryption.roll_right(0x80, 4)).equal(8);
    });

    it('test encrypt()', () => {
        expect(Compare.compare_buffers(MapleCustomEncryption.encrypt(test_bytes), test_answer)).equal(true);
    });

    it('test decrypt()', () => {
        // Should you expect the decrypted data to match the unencrypted data?
        expect(Compare.compare_buffers(decrypted_answer, MapleCustomEncryption.decrypt(test_answer))).equal(true);
    });
});