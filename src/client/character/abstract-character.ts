import { AbstractAnimatedMapleMapObject } from "../../server/maps/abstract-anim-map-object";
import { MapleMapObjectType } from "../../server/maps/map-object.type";
import { EventEmitter } from 'events';


export abstract class AbstractMapleCharacter extends AbstractAnimatedMapleMapObject {
    // TODO: Needs implementation
    // TODO: Implement AbstractAnimatedMapleMapObject

    map: MapleMap;
    str: number; dex: number; luk: number; int: number; 
    private hp: number; private max_hp: number; private mp: number; private max_mp: number;
    hp_mp_ap_used: number; remaining_ap: number;
    remaining_sp: Array<number> = new Array(10);
    client_max_hp: number; client_max_mp: number; local_max_hp: number; local_max_mp: number;
    transient_hp: number; transient_mp: number;
    events: EventEmitter = new EventEmitter();

    lister: AbstractCharacterListener = null;
    stat_updates: Map<MapleStat, number> = new Map();

    is_alive(): boolean {
        return this.hp > 0;
    }

    get_hp() {
        return this.hp;
    }

    get_mp() {
        return this.mp;
    }

    set_hp(new_hp: number) {
        let old_hp = this.hp;
        let thp = new_hp;
        if (thp < 0) thp = 0;
        else if (thp > this.local_max_hp) thp = this.local_max_hp;

        if (this.hp != thp) this.transient_hp = Number.MIN_VALUE;
        this.hp = thp;
        this.events.emit('hp_changed', old_hp, this.hp);
    }

    set_mp(new_mp: number) {
        let old_mp = this.mp;
        let tmp = new_mp;
        if (tmp < 0) tmp = 0;
        else if (tmp > this.local_max_mp) tmp = this.local_max_hp;

        if (this.mp != tmp) this.transient_mp = Number.MIN_VALUE;
        this.mp = tmp;
        this.events.emit('mp_changed', old_mp, this.mp);
    }

    // TODO: Finish implementation
}