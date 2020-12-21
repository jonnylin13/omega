import { AbstractAnimatedMapleMapObject } from "../../server/maps/abstract-anim-map-object";
import { EventEmitter } from 'events';
import { MapleStat } from "./stat";
import { Config } from "../../util/config";


export class Short {
    static MIN_VALUE() {
        return -2 ^ 15;
    }

    static MAX_VALUE() {
        return (2 ^ 15) - 1;
    }
}


export abstract class AbstractMapleCharacter extends AbstractAnimatedMapleMapObject {

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

    private static ap_assigned(x: number) {
        return x != null ? x : 0;
    }

    is_alive(): boolean {
        return this.hp > 0;
    }

    get_hp() {
        return this.hp;
    }

    get_mp() {
        return this.mp;
    }

    get_max_hp() {
        return this.max_hp;
    }

    get_max_mp() {
        return this.max_mp;
    }

    get_remaining_sp() {
        return this.remaining_sp;
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

        if (this.stat_updates.size > 0) {
            if (pool_update) this.events.emit('hp_mp_pool_updated');
            if (stat_update) this.events.emit('stat_updated');
            if (!silent) this.events.emit('stat_pool_update_announced');
        }
    }

    heal_hp_mp() {
        this.update_hp_mp(30000, 30000);
    }

    update_hp_mp(hp: number, mp: number) {
        this.change_hp_mp(hp, mp, false);
    }

    protected change_hp_mp(hp: number, mp: number, silent: boolean) {
        this.change_hp_mp_pool(hp, mp, null, null, silent);
    }

    private change_hp_mp_pool(hp: number, mp: number, max_hp: number, max_mp: number, silent: boolean) {
        let hp_mp_pool = AbstractMapleCharacter.calc_stat_pool_long(hp, mp, max_hp, max_mp);
        this.change_stat_pool(hp_mp_pool, null, null, -1, silent);
    }

    update_hp(hp: number) {
        this.update_hp_max_hp(hp, null);
    }

    update_max_hp(max_hp: number) {
        this.update_hp_max_hp(null, max_hp);
    }

    update_hp_max_hp(hp: number, max_hp: number) {
        this.change_hp_mp_pool(hp, null, max_hp, null, false);
    }

    update_mp(mp: number) {
        this.update_mp_max_mp(mp, null);
    }

    update_max_mp(max_mp: number) {
        this.update_mp_max_mp(null, max_mp);
    }

    update_mp_max_mp(mp: number, max_mp: number) {
        this.change_hp_mp_pool(null, mp, null, max_mp, false);
    }

    update_max_hp_max_mp(max_hp: number, max_mp: number) {
        this.change_hp_mp_pool(null, null, max_hp, max_mp, false);
    }

    protected enforce_max_hp_mp() {
        if (this.mp > this.local_max_mp || this.hp > this.local_max_mp)
            this.change_hp_mp(this.hp, this.mp, false);
    }

    safe_add_hp(delta: number) {
        if (this.hp + delta < 0) delta = -this.hp + 1;
        this.add_hp(delta);
        return delta;
    }

    add_hp(delta: number) {
        this.update_hp(this.hp + delta);
    }

    add_mp(delta: number) {
        this.update_mp(this.mp + delta);
    }

    add_hp_mp(delta_hp: number, delta_mp: number) {
        this.update_hp_mp(this.hp + delta_hp, this.mp + delta_mp);
    }

    add_max_hp_max_mp(delta_hp: number, delta_mp: number, silent: boolean) {
        this.change_hp_mp_pool(null, null, this.max_hp + delta_hp, this.max_mp + delta_mp, silent);
    }

    add_max_hp(delta: number) {
        this.update_max_hp(this.max_hp + delta);
    }

    add_max_mp(delta: number) {
        this.update_max_mp(this.mp + delta);
    }

    assign_str(x: number): boolean {
        return this.assign_str_dex_int_luk(x, null, null, null);
    }

    assign_dex(x: number): boolean {
        return this.assign_str_dex_int_luk(null, x, null, null);
    }

    assign_int(x: number): boolean {
        return this.assign_str_dex_int_luk(null, null, x, null);
    }

    assign_luk(x: number): boolean {
        return this.assign_str_dex_int_luk(null, null, null, x);
    }

    assign_hp(delta_hp: number, delta_ap: number): boolean {
        if (this.remaining_ap - delta_ap < 0 || this.hp_mp_ap_used + delta_ap < 0 || this.max_hp >= 30000) return false;
        let hp_mp_pool = AbstractMapleCharacter.calc_stat_pool_long(null, null, this.max_hp + delta_hp, this.max_mp);
        let str_dex_int_luk = AbstractMapleCharacter.calc_stat_pool_long(this.str, this.dex, this.int, this.luk);
        this.change_stat_pool(hp_mp_pool, str_dex_int_luk, null, this.remaining_ap - delta_ap, false);
        this.hp_mp_ap_used += delta_ap;
        return true;
    }

    assign_mp(delta_mp: number, delta_ap: number): boolean {
        if (this.remaining_ap - delta_ap < 0 || this.hp_mp_ap_used + delta_ap < 0 || this.max_mp >= 30000) return false;
        let hp_mp_pool = AbstractMapleCharacter.calc_stat_pool_long(null, null, this.max_hp, this.max_mp + delta_mp);
        let str_dex_int_luk = AbstractMapleCharacter.calc_stat_pool_long(this.str, this.dex, this.int, this.luk);
        this.change_stat_pool(hp_mp_pool, str_dex_int_luk, null, this.remaining_ap - delta_ap, false);
        this.hp_mp_ap_used += delta_ap;
        return true;
    }

    assign_str_dex_int_luk(delta_str: number, delta_dex: number, delta_int: number, delta_luk: number): boolean {
        let ap_used = AbstractMapleCharacter.ap_assigned(delta_str) + AbstractMapleCharacter.ap_assigned(delta_dex) + AbstractMapleCharacter.ap_assigned(delta_int) + AbstractMapleCharacter.ap_assigned(delta_luk);
        if (ap_used > this.remaining_ap) return false;
        let new_str = this.str;
        let new_dex = this.dex;
        let new_int = this.int;
        let new_luk = this.luk;
        if (delta_str != null && delta_str != undefined) new_str += delta_str;
        if (delta_dex != null && delta_dex != undefined) new_dex += delta_dex;
        if (delta_int != null && delta_int != undefined) new_int += delta_int;
        if (delta_luk != null && delta_luk != undefined) new_luk += delta_luk;

        if (new_str < 4 || new_str > Config.properties.server.max_ap) return false;
        if (new_dex < 4 || new_dex > Config.properties.server.max_ap) return false;
        if (new_int < 4 || new_int > Config.properties.server.max_ap) return false;
        if (new_luk < 4 || new_luk > Config.properties.server.max_ap) return false;
        let new_ap = this.remaining_ap - ap_used;
        this.update_str_dex_int_luk(new_str, new_dex, new_int, new_luk, new_ap);
        return true;
    }

    change_remaining_ap(x: number, silent: boolean) {
        this.change_str_dex_int_luk(this.str, this.dex, this.int, this.luk, x, silent);
    }

    gain_ap(delta_ap: number, silent: boolean) {
        this.change_remaining_ap(Math.max(0, this.remaining_ap + delta_ap), silent);
    }

    protected update_str_dex_int_luk(str: number, dex: number, int: number, luk: number, remaining_ap: number) {
        this.change_str_dex_int_luk(str, dex, int, luk, remaining_ap, false);
    }

    private change_str_dex_int_luk(str: number, dex: number, int: number, luk: number, remaining_ap: number, silent: boolean) {
        let str_dex_int_luk = AbstractMapleCharacter.calc_stat_pool_long(str, dex, int, luk);
        this.change_stat_pool(null, str_dex_int_luk, null, remaining_ap, silent);
    }

    private change_str_dex_int_luk_sp(str: number, dex: number, int: number, luk: number, remaining_ap: number, remaining_sp: number, skillbook: number, silent: boolean) {
        let str_dex_int_luk = AbstractMapleCharacter.calc_stat_pool_long(str, dex, int, luk);
        let sp = AbstractMapleCharacter.calc_stat_pool_long(0, 0, remaining_sp, skillbook);
        this.change_stat_pool(null, str_dex_int_luk, sp, remaining_ap, silent);
    }

    protected update_str_dex_int_luk_sp(str: number, dex: number, int: number, luk: number, remaining_ap: number, remaining_sp: number, skillbook: number) {
        this.change_str_dex_int_luk_sp(str, dex, int, luk, remaining_ap, remaining_sp, skillbook, false);
    }

    protected set_remaining_sp_array(sp: Array<number>) {
        this.remaining_sp = Array.from(sp);
    }

    protected update_remaining_sp(remaining_sp: number, skillbook: number) {
        this.change_remaining_sp(remaining_sp, skillbook, false);
    }

    protected change_remaining_sp(remaining_sp: number, skillbook: number, silent: boolean) {
        let sp = AbstractMapleCharacter.calc_stat_pool_long(0, 0, remaining_sp, skillbook);
        this.change_stat_pool(null, null, sp, Short.MIN_VALUE(), silent);
    }

    gain_sp(delta_sp: number, skillbook: number, silent: boolean) {
        this.change_remaining_sp(Math.max(0, this.remaining_sp[skillbook] + delta_sp), skillbook, silent);
    }
}