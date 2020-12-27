import { expect } from 'chai';
import { it, describe } from 'mocha';
import { File } from '../../../src/util/types/file';


const readme = new File('README.md');
const rootDir = new File('./');

describe('util/file.ts', () => {
    it('should load the README', () => {
        expect(readme.name).to.equal('README.md');
    });

    it('should list the files in root directory', () => {
        expect(rootDir.isDirectory()).to.equal(true);
        let foundReadme = false;
        for (let file of rootDir.list()) {
            if (file.name === 'README.md') {
                foundReadme = true;
                break;
            }
        }
        expect(foundReadme).to.equal(true);
    });
});