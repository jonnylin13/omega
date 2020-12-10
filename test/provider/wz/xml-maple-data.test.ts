import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { File } from '../../../src/provider/wz/file';
import { XMLMapleData } from '../../../src/provider/wz/xml-maple-data';
import * as fs from 'fs';

describe('XMLMapleData test', () => {
    it('should load wz/Character.wz/Accessory/01010000.img.xml', () => {
        let dir = new File('wz/Character.wz/Accessory/');
        let dom = XMLMapleData.from_string(fs.readFileSync('wz/Character.wz/Accessory/01010000.img.xml').toString(), dir);

        let tag = ((dom.children[0].children[4] as XMLMapleData).tag_name);
        let value = dom.children[0].children[4].data;
        let name = dom.children[0].children[4].name;
        
        expect(tag).equal('int');
        expect(value).equal(0);
        expect(name).equal('reqJob');
    });

    it('should load wz/Quest/PQuest.img.xml and get node by path', () => {
        let dir = new File('wz/Quest.wz/PQuest.img.xml');
        let root = XMLMapleData.from_string(fs.readFileSync('wz/Quest.wz/PQuest.img.xml').toString(), dir);

        let path = (root.children[0].children[2].children[0].children[0].children[0] as XMLMapleData).path;
        let data = root.get_child_by_path(path);
        expect((data as XMLMapleData).data).equal(6);
    });
});