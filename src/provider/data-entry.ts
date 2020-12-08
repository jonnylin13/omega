import { MapleDataEntity } from './data-entity';

export interface MapleDataEntry extends MapleDataEntity {
    get_size(): number;
    get_checksum(): number;
    get_offset(): number;
}