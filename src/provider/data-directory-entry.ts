import { MapleDataEntry } from './data-entry';
import { MapleDataFileEntry } from './data-file-entry';

export interface MapleDataDirectoryEntry extends MapleDataEntry {
    subdirs: Array<MapleDataDirectoryEntry>;
    files: Array<MapleDataFileEntry>;
    entries?: Map<string, MapleDataEntry>;
    get_entry(name: string): MapleDataEntry;
}