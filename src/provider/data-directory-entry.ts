import { MapleDataEntry } from './data-entry';
import { MapleDataFileEntry } from './data-file-entry';

export interface MapleDataDirectoryEntry extends MapleDataEntry {
    readonly subdirs: Array<MapleDataDirectoryEntry>;
    readonly files: Array<MapleDataFileEntry>;
    readonly entries: Map<string, MapleDataEntry>;
    get_entry(name: string): MapleDataEntry;
    add_directory(dir: MapleDataDirectoryEntry): void;
    add_file(file_entry: MapleDataFileEntry): void;
}