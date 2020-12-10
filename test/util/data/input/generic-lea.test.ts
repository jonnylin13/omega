import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { GenericLittleEndianAccessor } from '../../../../src/util/data/input/generic-lea';

const data = new Uint8Array([0xFF, 0x00, 0xFE, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00]);
const data_str = new Int8Array([0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67]);
const data_str_terminated = new Int8Array([0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x00]);
const data_str_maple = new Int8Array([0x13, 0x00, 0x6f, 0x6d, 0x67, 0x20, 0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67]);

describe('GenericLittleEndianAccessor test', () => {
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

    it('test read_ascii_string()', () => {
        let llea = new GenericLittleEndianAccessor(Buffer.from(data_str));
        expect(llea.read_ascii_string(19)).equal('omg this is working');
    });

    it('test read_terminated_ascii_string()', () => {
        let llea = new GenericLittleEndianAccessor(Buffer.from(data_str_terminated));
        expect(llea.read_terminated_ascii_string()).equal('omg this is working');
    });

    it('test read_maple_ascii_string()', () => {
        let llea = new GenericLittleEndianAccessor(Buffer.from(data_str_maple));
        expect(llea.read_maple_ascii_string()).equal('omg this is working');
    });
});