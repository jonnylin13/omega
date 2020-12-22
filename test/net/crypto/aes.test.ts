import { expect, should } from 'chai';
import { describe, it } from 'mocha'; 
import { AES } from '../../../src/net/crypto/aes';
import { Compare } from '../../../src/util/compare';

const input = Buffer.from([0x13, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0xB4, 0x00, 0x00, 0x00, 0x1B, 0x00, 0x00, 0x00, 0x0F, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00, 0x52, 0x00, 0x00, 0x00]);
const expected_output = Buffer.from([19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0]);
let wtf: Buffer = Buffer.from([0xf2, 0x53, 0x50, 0xc6]);

describe('AES test', () => {
    it('test multiply_bytes()', () => {
        let result = Compare.compare_buffers(AES.multiply_bytes(input, 4, 4), expected_output);
        expect(result).equal(true);
    });

    it('test morph_iv()', () => {
        let result = Compare.compare_buffers(AES.morph_iv(0x01, wtf), Buffer.from([-9, 32, 31, 63]));
        expect(result).equal(true);
    });

    it('test get_new_iv()', () => {
        let result = Compare.compare_buffers(AES.get_new_iv(Buffer.from([0x01, 0x02, 0x03, 0x80])), Buffer.from([-102, -117, -63, 34]));
        expect(result).equal(true);
    });

    it('test encrypt()', () => {
        let iv = Buffer.from([0x01, 0x02, 0x03, 0x04, 
                                0x05, 0x01, 0x02, 0x04, 
                                0x05, 0x01, 0x02, 0x06,
                                0x0f, 0x0a, 0x0b, 0x0c]);
        let data = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);
        let aes = new AES(iv, 83);
        console.log(aes.generate_packet_header(4));
        console.log(aes.get_packet_header(4));
        // TODO: Implement a test for this
    });
    
    // TODO: Write a test for:
    // * get_packet_header
    // * check_packet
    // * check_packet_by_header
});