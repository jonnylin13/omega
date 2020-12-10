import { expect, should } from 'chai';
import { describe, it } from 'mocha'; 
import { File } from '../../../src/provider/wz/file';
import { XMLWZFile } from '../../../src/provider/wz/xml-wz-file';

describe('XMLWZFile test', () => {
    it('should load a wz dir', () => {
        let xml_wz_file = new XMLWZFile(new File('wz/Base.wz'));
        expect(xml_wz_file.root.name).equal('Base.wz');
        expect(xml_wz_file.get_data('smap.img').children[0].name).equal('mobEquipFront');
    });
});