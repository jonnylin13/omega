import { MapleDataEntry } from './data-entry';
import { MapleDataFileEntry } from './data-file-entry';

export interface MapleDataDirectoryEntry extends MapleDataEntry {
    subdirectories: Array<MapleDataDirectoryEntry>;
    files: Array<MapleDataFileEntry>;
    get_entry(name: string): MapleDataEntry;
}