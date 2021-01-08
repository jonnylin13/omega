import { expect } from 'chai';
import { it, describe } from 'mocha';
import { AES } from '../../../src/protocol/crypto/aes';


const iv = Buffer.from([0x00, 0x00, 0x00, 0x00]);
const aes = new AES(iv, 83);
const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
const result = Buffer.from([0x00, 0x60, 0x27, 0x5b]);

describe('protocol/crypto/aes.ts', () => {

    it('should encrypt data', () => {
        expect(aes.transform(data)).to.deep.equal(result);
    });

    it('should generate packet header', () => {
        expect(aes.generatePacketHeader(8)).to.deep.equal(Buffer.from([0x37, 0xc7, 0x3f, 0xc7]));
    });

    it('should morph the iv', () => {
        expect((aes as any).morphIV(Buffer.from([0x1, 0x2, 0x3, 0x4]))).to.deep.equal(Buffer.from([0x7b, 0xbf, 0xa4, 0x56]));
    });

});