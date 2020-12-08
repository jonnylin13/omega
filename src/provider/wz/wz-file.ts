import { MapleData } from '../data';
import { MapleDataDirectoryEntry } from '../data-directory-entry';
import { MapleDataFileEntry } from '../data-file-entry';
import { MapleDataProvider } from '../data-provider';
import { File } from './file';
import { WZDirectoryEntry } from './wz-directory-entry';
import * as fs from 'fs';


export class WZFile implements MapleDataProvider {

    // TODO: Make sure this is similar to Java static constructors
    // https://stackoverflow.com/questions/49589518/static-constructor-typescript
    static _initialize() {
        // ListWZFile.init();
    }

    wz_file: File;
    header_size: number;
    root: WZDirectoryEntry;
    provide_images: boolean;
    c_offset: number;
    buffer: Buffer;

    constructor(wz_file: File, provide_images: boolean) {
        this.wz_file = wz_file;
        
        this.buffer = Buffer.from(fs.readFileSync(wz_file.path, {encoding: 'hex'}), 'hex');
    }
}