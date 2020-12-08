import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { Compare } from '../../src/util/compare';

let arr1 = new Uint8Array([0xFF, 0x00, 0xFE]);
let arr2 = new Uint8Array([0xFF, 0x00]);

describe('Compare test', () => {
    it('should return true', () => {
        expect(Compare.compare_uint8_array(arr1, arr1)).equal(true);
    });

    it('should return false', () => {
        expect(Compare.compare_uint8_array(arr1, arr2)).equal(false);
    });
});