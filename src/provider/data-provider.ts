import { MapleDataEntity } from "./data-entity";

import { MapleData } from './data';
import { MapleDataDirectoryEntry } from './data-directory-entry';


export interface MapleDataProvider {
    root: MapleDataDirectoryEntry;
    get_data(path: string): MapleData;
}