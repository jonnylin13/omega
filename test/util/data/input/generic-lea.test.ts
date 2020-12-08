import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { GenericLittleEndianAccessor } from '../../../../src/util/data/input/generic-lea';

const data = new Uint8Array([0xFF, 0x00, 0xFE, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00]);

describe('Generic lea test', () => {
    const lea = new GenericLittleEndianAccessor(Buffer.from(data));
    it('test read_byte()', () => {
        expect(lea.read_byte()).equal(-1);
    });

    it('test read_short()', () => {
        expect(lea.read_short()).equal(-512);
    });

    it('test read_char()', () => {
        expect(lea.read_char()).equal('a');
    });

    it('test read_int()', () => {
        expect(lea.read_int()).equal(10);
    });

    it('test read_float()', () => {
        expect(lea.read_float()).equal(3.5733110840282835e-43);
    });
    
    // TODO: Finish test cases
});