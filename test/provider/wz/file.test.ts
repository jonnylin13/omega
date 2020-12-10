import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { File } from '../../../src/provider/wz/file';

describe('File test', () => {
    it('should get parent File', () => {
        let child = new File('wz/Character.wz/Accessory/01010000.img.xml');
        let parent = child.get_parent_file();
        expect(parent.name).equal('Accessory');
        expect(parent.path).equal('wz/Character.wz/Accessory');
    });

    it('should list Files from directory File', () => {
        let dir = new File('wz/Character.wz/Accessory');
        expect(dir.list_files()[0].name).equal('01010000.img.xml');
    });

    it('test isDirectory()', () => {
        let file = new File('wz/Character.wz/Accessory/01010000.img.xml');
        let parent = file.get_parent_file();
        expect(file.is_directory()).equal(false);
        expect(parent.is_directory()).equal(true);
    });
});