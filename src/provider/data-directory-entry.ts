import { MapleDataEntry } from './data-entry';
import { MapleDataFileEntry } from './data-file-entry';

export interface MapleDataDirectoryEntry extends MapleDataEntry {
    get_subdirectories(): Array<MapleDataDirectoryEntry>;
    get_files(): Array<MapleDataFileEntry>;
    get_entry(name: string): MapleDataEntry;
}