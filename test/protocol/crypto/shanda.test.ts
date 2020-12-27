import { expect } from 'chai';
import { it, describe } from 'mocha';
import { Shanda } from '../../../src/protocol/crypto/shanda';


describe('protocol/crypto/shanda.ts', () => {

    it('should encrypt data', () => {
        const encrypted = Shanda.encrypt(Buffer.from([0, 0x01, 0x02, 0x03]));
        const result = Buffer.from([0xe6, 0xf1, 0xf2, 0x36]);
        expect(encrypted).to.deep.equal(result);
        expect(encrypted.length).to.be.equal(result.length);
    });

    it('should decrypt data', () => {
        const encrypted = Shanda.decrypt(Buffer.from([0xe6, 0xf1, 0xf2, 0x36]));
        const result = Buffer.from([0, 0x01, 0x02, 0x03]);
        expect(encrypted).to.deep.equal(result);
        expect(encrypted.length).to.be.equal(result.length);
    });

});