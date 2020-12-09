import { MapleData } from '../data';
import { MapleDataEntity } from '../data-entity';
import { MapleDataType } from './data-type';


export class MapleIMGEntry implements MapleData {
    name: string;
    type: MapleDataType;
    children: Array<MapleData> = new Array<MapleData>(10);
    data: Object;
    parent: MapleDataEntity;

    constructor(parent: MapleDataEntity) {
        this.parent = parent;
    }

    get_child_by_path(path: string): MapleData {
        let segments = path.split('/');
        if (segments[0] === '..')
            return (this.parent as MapleData).get_child_by_path(path.substring(path.indexOf('/') + 1));
        let ret: MapleData = null;
        for (let i = 0; i < segments.length; i++) {
            let found_child = false;
            for (let child of this.children) {
                if (child.name === segments[i]) {
                    ret = child;
                    found_child = true;
                    break;
                }
            }
            if (!found_child) return ret; // Null
        }
        return ret;
    }

    // TODO: Needs implementation
    finish(): void {}
}