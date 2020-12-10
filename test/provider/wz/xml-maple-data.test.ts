import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { File } from '../../../src/provider/wz/file';
import { XMLMapleData } from '../../../src/provider/wz/xml-maple-data';
import * as fs from 'fs';
const root_dir = require('app-root-path');

describe('XMLMapleData test', () => {
    it('should load Character.wz/Accessory/01010000.img.xml file', () => {
        let dir = new File(root_dir + '/wz/Character.wz/Accessory/');
        let dom = XMLMapleData.from_string(fs.readFileSync(root_dir + '/wz/Character.wz/Accessory/01010000.img.xml').toString(), dir);
        let tag = ((dom.children[0].children[4] as XMLMapleData).tag_name);
        let value = dom.children[0].children[4].data;
        let name = dom.children[0].children[4].data;
        
        expect(tag).equal('int');
        console.log(typeof value);
        expect(value).equal(0);
        expect(name).equal('reqJob');
    });
});