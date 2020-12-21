import { MapleClient } from "../../../client/client";
import { Point } from "../../../util/point";
import { MapleMapObjectType } from "../map-object.type";


export interface MapleMapObject {
    object_id: number;
    type: MapleMapObjectType;
    position: Point;
    send_spawn_data(c: MapleClient): void;
    send_destroy_data(c: MapleClient): void;
    nullify_position(): void;
}