import { MapleDataEntity } from './data-entity';
import { MapleDataType } from './wz/data-type';

export interface MapleData extends MapleDataEntity {
    get_type(): MapleDataType;
    get_children(): Array<MapleData>;
    get_child_by_path(path: string): MapleData;
    get_data(): Object;
}