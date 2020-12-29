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

    // test generatePacketHeader()

});