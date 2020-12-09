import { MapleData } from '../data';
import { MapleDataDirectoryEntry } from '../data-directory-entry';
import { MapleDataFileEntry } from '../data-file-entry';
import { MapleDataProvider } from '../data-provider';
import { File } from './file';
import { WZDirectoryEntry } from './wz-directory-entry';
import * as fs from 'fs';
import { GenericSeekableLittleEndianAccessor } from '../../util/data/input/generic-seekable-lea';
import { GenericLittleEndianAccessor } from '../../util/data/input/generic-lea';


export class WZFile implements MapleDataProvider {

    // TODO: Make sure this is similar to Java static constructors
    // https://stackoverflow.com/questions/49589518/static-constructor-typescript
    // static init() {
        // ListWZFile.init();
    // }

    wz_file: File;
    header_size: number;
    root: WZDirectoryEntry;
    provide_images: boolean;
    c_offset: number;
    slea: GenericSeekableLittleEndianAccessor;
    lea: GenericLittleEndianAccessor;

    constructor(wz_file: File, provide_images: boolean) {
        this.wz_file = wz_file;
        let buffer_from_wz = Buffer.from(fs.readFileSync(wz_file.path, {encoding: 'hex'}), 'hex');
        this.lea = new GenericLittleEndianAccessor(buffer_from_wz);
        this.slea = new GenericSeekableLittleEndianAccessor(buffer_from_wz);
        this.root = new WZDirectoryEntry(this.wz_file.name, 0, 0, null);
        this.provide_images = provide_images;
        this.load();
    }

    private load(): void {
        this.lea.read_ascii_string(4);
        this.lea.read_int();
        this.lea.read_int();
        let header_size = this.lea.read_int();
        this.lea.read_terminated_ascii_string();
        this.lea.read_short();
        this.parse_directory(this.root);
        this.c_offset = this.lea.bytes_read;
        this.get_offsets(this.root);
    }

    private get_offsets(dir: MapleDataDirectoryEntry): void {
        for (let file of dir.files) {
            file.offset = this.c_offset;
            this.c_offset += file.size;
        }
        for (let sdir of dir.subdirs) {
            this.get_offsets(sdir);
        }
    }

    private parse_directory(dir: MapleDataDirectoryEntry): void {
        
    }
}