import { MapleDataEntity } from "./data-entity";

import { MapleData } from './data';
import { MapleDataDirectoryEntry } from './data-directory-entry';


export interface MapleDataProvider {
    get_data(path: string): MapleData;
    get_root(): MapleDataDirectoryEntry;
}