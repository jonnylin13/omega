import { MapleDataEntity } from './data-entity';

export interface MapleDataEntry extends MapleDataEntity {
    size: number;
    checksum: number;
    offset: number;
}