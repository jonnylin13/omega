import { AbstractAnimatedMapleMapObject } from "../../server/maps/abstract-anim-map-object";
import { MapleMapObjectType } from "../../server/maps/map-object.type";
import { EventEmitter } from 'events';


export class Short {
    static MIN_VALUE() {
        return -2 ^ 15;
    }

    static MAX_VALUE() {
        return (2 ^ 15) - 1;
    }
}


export abstract class AbstractMapleCharacter extends AbstractAnimatedMapleMapObject {
    // TODO: Needs implementation
    // TODO: Implement AbstractAnimatedMapleMapObject

    map: MapleMap;
    str: number; dex: number; luk: number; int: number; 
    protected hp: number; protected max_hp: number; protected mp: number; protected max_mp: number;
    hp_mp_ap_used: number; remaining_ap: number;
    protected remaining_sp: Array<number> = new Array(10);
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
        this.events.emit('hp_updated', old_hp, this.hp);
    }

    set_mp(new_mp: number) {
        let old_mp = this.mp;
        let tmp = new_mp;
        if (tmp < 0) tmp = 0;
        else if (tmp > this.local_max_mp) tmp = this.local_max_hp;

        if (this.mp != tmp) this.transient_mp = Number.MIN_VALUE;
        this.mp = tmp;
        this.events.emit('mp_updated', old_mp, this.mp);
    }

    set_max_hp(new_max_hp: number) {
        if (this.max_hp < new_max_hp) this.transient_hp = Number.MIN_VALUE;
        this.max_hp = new_max_hp;
        this.client_max_hp = Math.min(30000, new_max_hp);
    }

    set_max_mp(new_max_mp: number) {
        if (this.max_mp < new_max_mp) this.transient_mp = Number.MIN_VALUE;
        this.max_mp = new_max_mp;
        this.client_max_mp = Math.min(30000, new_max_mp);
    }

    set_remaining_sp(remaining_sp: number, skillbook: number) {
        this.remaining_sp[skillbook] = remaining_sp;
    }

    private static clamp_stat(v: number, min: number, max: number): bigint {
        return BigInt((v < min) ? min : ((v > max) ? max : v));
    }

    private static calc_stat_pool_node(v: number, displacement: number): bigint {
        let r: bigint;
        if (v == null || v == undefined)
            r = BigInt(-32768);
        else
            r = this.clamp_stat(v, -32767, 32767);
        return (r & BigInt(0x0FFFF)) << BigInt(displacement);
    }

    private static calc_stat_pool_long(v1: number, v2: number, v3: number, v4: number): bigint {
        let r: bigint = BigInt(0);
        r |= (this.calc_stat_pool_node(v1, 48));
        r |= (this.calc_stat_pool_node(v2, 32));
        r |= (this.calc_stat_pool_node(v3, 16));
        r |= (this.calc_stat_pool_node(v4, 0));
        return r;
    }

    private change_stat_pool(hp_mp_pool: bigint, str_dex_int_luk: bigint, new_sp: bigint, new_ap: number, silent: boolean) {
        this.stat_updates.clear();
        let pool_update = false;
        let stat_update = false;

        if (hp_mp_pool != null && hp_mp_pool != undefined) {
            let new_hp = Number(hp_mp_pool >> BigInt(48));
            let new_mp = Number(hp_mp_pool >> BigInt(32));
            let new_max_hp = Number(hp_mp_pool >> BigInt(16));
            let new_max_mp = Number(hp_mp_pool >> BigInt.asIntN(16, hp_mp_pool)); // TODO: Needs validation, is this the same as Long#shortValue()?
            if (new_max_hp != Short.MIN_VALUE()) { // TODO: Needs validation
                if (new_max_hp < 50) new_max_hp = 50;
                pool_update = true;
                this.set_max_hp(new_max_hp);
                this.stat_updates.set(MapleStat.MAX_HP, this.client_max_hp);
                this.stat_updates.set(MapleStat.HP, this.hp);
            }

            if (new_hp != Short.MIN_VALUE()) {
                this.set_hp(new_hp);
                this.stat_updates.set(MapleStat.HP, this.hp);
            }

            if (new_max_mp != Short.MIN_VALUE()) {
                if (new_max_mp < 5) new_max_mp = 5;
                pool_update = true;
                this.set_max_mp(new_max_mp);
                this.stat_updates.set(MapleStat.MAX_MP, this.client_max_mp);
                this.stat_updates.set(MapleStat.MP, this.mp);
            }

            if (new_mp != Short.MIN_VALUE()) {
                this.set_mp(new_mp);
                this.stat_updates.set(MapleStat.MP, this.mp);
            }
        }

        if (str_dex_int_luk != null && str_dex_int_luk != undefined) {
            let new_str = Number(str_dex_int_luk >> BigInt(48));
            let new_dex = Number(str_dex_int_luk >> BigInt(32));
            let new_int = Number(str_dex_int_luk >> BigInt(16));
            let new_luk = Number(str_dex_int_luk >> BigInt.asIntN(16, str_dex_int_luk));

            if (new_str >= 4) {
                this.str = new_str;
                this.stat_updates.set(MapleStat.STR, this.str);
            }

            if (new_dex >= 4) {
                this.dex = new_dex;
                this.stat_updates.set(MapleStat.DEX, this.dex);
            }

            if (new_int >= 4) {
                this.int = new_int;
                this.stat_updates.set(MapleStat.INT, this.int);
            }

            if (new_luk >= 4) {
                this.luk = new_luk;
                this.stat_updates.set(MapleStat.LUK, this.luk);
            }

            if (new_ap >= 0) {
                this.remaining_ap = new_ap;
                this.stat_updates.set(MapleStat.AVAILABLE_AP, this.remaining_ap);
            }

            stat_update = true;
                
        }

        if (new_sp != null && new_sp != undefined) {
            let sp = Number(new_sp >> BigInt(16));
            let skillbook = Number(BigInt.asIntN(16, new_sp));
            this.set_remaining_sp(sp, skillbook);
            this.stat_updates.set(MapleStat.AVAILABLE_SP, this.remaining_sp[skillbook]);
        }

        if (this.stat_updates.length > 0) {
            if (pool_update) this.events.emit('hp_mp_pool_updated');
            if (stat_update) this.events.emit('stat_updated');
            if (!silent) this.events.emit('stat_pool_update_announced');
        }
    }

    // TODO: Finish implementation
}