import { expect, should } from 'chai';
import { describe, it } from 'mocha'; 
import { MapleAESOFB } from '../../src/net/aes';
import { Convert } from '../../src/util/convert';

const input = new Int8Array([0x13, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0xB4, 0x00, 0x00, 0x00, 0x1B, 0x00, 0x00, 0x00, 0x0F, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00, 0x52, 0x00, 0x00, 0x00]);
const expected_output = new Int8Array([19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0]);

describe('MapleAESOFB test', () => {
    it('test multiply_bytes()', () => {
        let result = Convert.compare_int8_array(MapleAESOFB.multiply_bytes(input, 4, 4), expected_output);
        expect(result).equal(true);
    });
});