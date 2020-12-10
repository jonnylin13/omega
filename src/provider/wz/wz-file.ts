import { MapleData } from '../data';
import { MapleDataDirectoryEntry } from '../data-directory-entry';
import { MapleDataProvider } from '../data-provider';
import { File } from './file';
import { WZDirectoryEntry } from './wz-directory-entry';
import * as fs from 'fs';
import { GenericSeekableLittleEndianAccessor } from '../../util/data/input/generic-seekable-lea';
import { GenericLittleEndianAccessor } from '../../util/data/input/generic-lea';
import { WZTool } from './wz-tool';
import { WZFileEntry } from './wz-file-entry';
import { WZIMGFile } from './wz-img-file';
import { ListWZFile } from './list-wz-file';


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
        this.header_size = this.lea.read_int();
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
        let entries = WZTool.read_value(this.lea);
        for (let i = 0; i < entries; i++) {
            let marker = this.lea.read_byte();
            let name: string;
            let size: number, checksum: number;
            switch (marker) {
                case 0x02:
                    name = WZTool.read_decoded_string_at_offset_and_reset(this.slea, this.lea.read_int() + this.header_size + 1);
                    size = WZTool.read_value(this.lea);
                    checksum = WZTool.read_value(this.lea);
                    this.lea.read_int();
                    dir.files.push(new WZFileEntry(name, size, checksum, dir));
                    break;
                case 0x03:
                case 0x04:
                    name = WZTool.read_decoded_string(this.lea);
                    size = WZTool.read_value(this.lea);
                    checksum = WZTool.read_value(this.lea);
                    this.lea.read_int();
                    if (marker === 3) dir.add_directory(new WZDirectoryEntry(name, size, checksum, dir));
                    else dir.files.push(new WZFileEntry(name, size, checksum, dir));
                    break;
                default:
                    break;
            }
        }
        for (let subdir of dir.subdirs) {
            this.parse_directory(subdir);
        }
    }

    // TODO: Needs validation
    get_img_file(path: string): WZIMGFile {
        let segments = path.split('/');
        let dir = this.root;
        for (let i = 0; i < segments.length - 1; i++) {
            dir = (dir.get_entry(segments[i]) as WZDirectoryEntry);
            if (dir === null) return null;
        }

        let entry = (dir.get_entry(segments[segments.length - 1]) as WZFileEntry);
        if (entry === null) return null;
        let full_path = this.wz_file.name.substring(0, this.wz_file.name.length - 3).toLowerCase() + '/' + path;
        return new WZIMGFile(this.wz_file, entry, this.provide_images, ListWZFile.is_modern_img_file(full_path));
    }

    get_data(path: string): MapleData {
        let img_file = this.get_img_file(path);
        if (img_file == null) {
            return null;
        }
        let ret = img_file.root;
        return ret;
    }
}