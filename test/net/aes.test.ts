import { expect, should } from 'chai';
import { describe, it } from 'mocha'; 
import { MapleAESOFB } from '../../src/net/aes';
import { Compare } from '../../src/util/compare';

const input = new Int8Array([0x13, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0xB4, 0x00, 0x00, 0x00, 0x1B, 0x00, 0x00, 0x00, 0x0F, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00, 0x52, 0x00, 0x00, 0x00]);
const expected_output = new Int8Array([19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0]);
let wtf: Int8Array = new Int8Array([0xf2, 0x53, 0x50, 0xc6]);

describe('MapleAESOFB test', () => {
    it('test multiply_bytes()', () => {
        let result = Compare.compare_int8_array(MapleAESOFB.multiply_bytes(input, 4, 4), expected_output);
        expect(result).equal(true);
    });

    it('test funny_shit()', () => {
        let result = Compare.compare_int8_array(MapleAESOFB.funny_shit(0x01, wtf), new Int8Array([-9, 32, 31, 63]));
        expect(result).equal(true);
    });

    it('test get_new_iv()', () => {
        let result = Compare.compare_int8_array(MapleAESOFB.get_new_iv(new Int8Array([0x01, 0x02, 0x03, 0x80])), new Int8Array([-102, -117, -63, 34]));
        expect(result).equal(true);
    });

    it('test encrypt()', () => {
        let iv = new Int8Array([0x01, 0x02, 0x03, 0x04, 
                                0x05, 0x01, 0x02, 0x04, 
                                0x05, 0x01, 0x02, 0x06,
                                0x0f, 0x0a, 0x0b, 0x0c]);
        let data = new Int8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);
        let aes = new MapleAESOFB(iv, 83);
        console.log(aes.encrypt(data, iv));
    })
});