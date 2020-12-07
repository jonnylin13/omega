import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { Convert } from '../../src/util/convert';

describe('Convert test', () => {
    it('should convert 0xFF to -1', () => {
        expect(Convert.sign_byte(0xFF)).equal(-1);
    });
});