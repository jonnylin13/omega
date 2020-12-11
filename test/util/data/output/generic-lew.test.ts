import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { GenericLittleEndianWriter } from '../../../../src/util/data/output/generic-lew';
import { GenericLittleEndianAccessor } from '../../../../src/util/data/input/generic-lea';

describe('GenericLittleEndianWriter test', () => {
    it('test write_byte()', () => {
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(1)));
        lew.write_byte(1);
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_byte()).equal(1);
    });

    it('test write_short()', () => {
        // expect(lea.read_short()).equal(-512);
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(2)));
        lew.write_short(200);
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_short()).equal(200);
    });

    it('test write_int()', () => {
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(4)));
        lew.write_int(65000);
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_int()).equal(65000);
    });

    it('test write_ascii_string()', () => {
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(4)));
        lew.write_ascii_string('test');
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_ascii_string(4)).equal('test');
    });

    it('test write_terminated_ascii_string()', () => {
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(5)));
        lew.write_terminated_ascii_string('test');
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_terminated_ascii_string()).equal('test');
    });

    it('test write_maple_ascii_string()', () => {
        const lew = new GenericLittleEndianWriter(Buffer.from(new Int8Array(6)));
        lew.write_maple_ascii_string('test');
        const lea = new GenericLittleEndianAccessor(lew.buf);
        expect(lea.read_maple_ascii_string()).equal('test');
    });
});