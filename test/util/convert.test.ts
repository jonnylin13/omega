import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { Convert } from '../../src/util/convert';

const data = new Int8Array([0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67]);

describe('Convert test', () => {
    it('should convert 0xFF to -1', () => {
        expect(Convert.sign_byte(0xFF)).equal(-1);
    });

    it('should convert byte array to "omg this is working"', () => {
        expect(Convert.buf_to_string(data)).equal('omg this is working');
    });
});