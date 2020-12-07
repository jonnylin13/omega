import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { MapleCustomEncryption } from '../../src/net/crypto';
import { Convert } from '../../src/util/convert';

const test_bytes: Int8Array = new Int8Array([0xe0, 0x4f, 0xd0,
    0x20, 0xea, 0x3a, 0x69, 0x10, 0xa2, 0xd8, 0x08, 0x00, 0x2b,
    0x30, 0x30, 0x9d ]);
const test_answer: Int8Array = new Int8Array([
    12, -95,   76,   9, -38,
    57, 106,  -22, -21, -62,
   126, 103, -110,  70,  84,
    44
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
        expect(Convert.compare_int8_array(MapleCustomEncryption.encrypt(test_bytes), test_answer)).equal(true);
    });
});