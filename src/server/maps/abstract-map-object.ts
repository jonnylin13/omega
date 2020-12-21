import { MapleClient } from "../../client/client";
import { Point } from "../../util/point";
import { MapleMapObject } from "./interface/map-object";
import { MapleMapObjectType } from "./map-object.type";



export abstract class AbstractMapleMapObject implements MapleMapObject {
    position: Point = new Point(0, 0);
    object_id: number;
    type: MapleMapObjectType;

    nullify_position() {
        this.position = null;
    }
    
    send_spawn_data(c: MapleClient) {

    }

    send_destroy_data(c: MapleClient) {

    }

    
}