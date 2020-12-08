import { MapleDataEntity } from '../data-entity';
import { MapleDataFileEntry } from '../data-file-entry';
import { WZEntry } from './wz-entry';


// What is this for??
export class WZFileEntry extends WZEntry implements MapleDataFileEntry {

    constructor(name: string, size: number, checksum: number, parent: MapleDataEntity) {
        super(name, size, checksum, parent);
    }
}