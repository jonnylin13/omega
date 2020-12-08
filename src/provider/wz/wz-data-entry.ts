import { MapleDataEntity } from '../data-entity';
import { MapleDataEntry } from '../data-entry';


export class WZEntry implements MapleDataEntry {
    name: string;
    size: number;
    checksum: number;
    offset: number;
    parent: MapleDataEntity;

    constructor(name: string, size: number, checksum: number, parent: MapleDataEntity) {
        this.name = name;
        this.size = size;
        this.checksum = checksum;
        this.parent= parent;
    }
}