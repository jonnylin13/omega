import { MapleMapObject } from "./map-object";


export interface AnimatedMapleMapObject extends MapleMapObject {
    stance: number;
    is_facing_left(): boolean;
}