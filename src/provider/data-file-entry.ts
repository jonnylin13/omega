import { MapleDataEntry } from './data-entry';

export interface MapleDataFileEntry extends MapleDataEntry {
    set_offset(offset: number): void;
}