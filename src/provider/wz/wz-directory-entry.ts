import { MapleDataDirectoryEntry } from '../data-directory-entry';
import { MapleDataEntity } from '../data-entity';
import { MapleDataEntry } from '../data-entry';
import { MapleDataFileEntry } from '../data-file-entry';
import { WZEntry } from './wz-entry';


export class WZDirectoryEntry extends WZEntry implements MapleDataDirectoryEntry {

    subdirs: Array<MapleDataDirectoryEntry> = [];
    files: Array<MapleDataFileEntry> = [];
    entries: Map<string, MapleDataEntry> = new Map();

    name: string;
    size: number;
    checksum: number;
    parent: MapleDataEntity;
    offset: number;

    constructor(name: string, size: number, checksum: number, parent: MapleDataEntity) {
        super(name, size, checksum, parent);
    }

    add_directory(dir: MapleDataDirectoryEntry) {
        this.subdirs.push(dir);
        this.entries.set(dir.name, dir);
    }

    add_file(file_entry: MapleDataFileEntry) {
        this.files.push(file_entry);
        this.entries.set(file_entry.name, file_entry);
    }

    get_entry(name: string): MapleDataEntry {
        return this.entries.get(name);
    }
}