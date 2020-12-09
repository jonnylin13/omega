import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { GenericSeekableLittleEndianAccessor } from '../../../../src/util/data/input/generic-seekable-lea';

const data = new Uint8Array([0xFF, 0x00, 0xFE, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00]);
const data_str = new Int8Array([0x01, 0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67]);
const data_str_terminated = new Int8Array([0x0, 0x0, 0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x00]);
const data_str_maple = new Int8Array([0x0, 0x0, 0x13, 0x00, 0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67]);

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

    it('test read_ascii_string()', () => {
        let llea = new GenericSeekableLittleEndianAccessor(Buffer.from(data_str));
        llea.seek(1);
        expect(llea.read_ascii_string(19)).equal('omg this is working');
    });

    it('test read_terminated_ascii_string()', () => {
        let llea = new GenericSeekableLittleEndianAccessor(Buffer.from(data_str_terminated));
        llea.seek(2);
        expect(llea.read_terminated_ascii_string()).equal('omg this is working');
    });

    it('test read_maple_ascii_string()', () => {
        let llea = new GenericSeekableLittleEndianAccessor(Buffer.from(data_str_maple));
        llea.seek(2);
        expect(llea.read_maple_ascii_string()).equal('omg this is working');
    });
    
    // TODO: Finish test cases
});