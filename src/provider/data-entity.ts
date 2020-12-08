import { MapleData } from "./data";

export interface MapleDataEntity {
    name: string;
    parent: MapleDataEntity;
}