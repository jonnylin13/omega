import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { GenericSeekableLittleEndianAccessor } from '../../../../src/util/data/input/generic-seekable-lea';

const data = new Uint8Array([0xFF, 0x00, 0xFE, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00]);

describe('GenericSeekableLittleEndianAccessor test', () => {
    const lea = new GenericSeekableLittleEndianAccessor(Buffer.from(data));
    it('test read_byte() at pos 1', () => {
        lea.seek(1);
        expect(lea.read_byte()).equal(0);
    });

    it('test read_short() at pos 1', () => {
        lea.seek(1);
        expect(lea.read_short()).equal(-512);
    });

    it('test read_char() at pos 3', () => {
        lea.seek(3);
        expect(lea.read_char()).equal('a');
    });

    it('test read_int() at pos 5', () => {
        lea.seek(5);
        expect(lea.read_int()).equal(10);
    });

    it('test read_float() at pos 9', () => {
        lea.seek(9);
        expect(lea.read_float()).equal(3.5733110840282835e-43);
    });
    
    // TODO: Finish test cases
});