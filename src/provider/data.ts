import { MapleDataEntity } from './data-entity';
import { MapleDataType } from './wz/data-type';

export interface MapleData extends MapleDataEntity {
    type: MapleDataType;
    children: Array<MapleData>;
    data: Object;
    get_child_by_path(path: string): MapleData;
}