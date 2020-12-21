import { MapleClient } from "../client";
import { AbstractMapleCharacter } from "./abstract-character";
import { MaplePet } from "./inventory/pet";
import { MapleJob } from "./job";
import { MapleSkinColor } from "./skin-color";


export class CharNameAndId {
    id: number;
    name: string;

    constructor(name: string, id: number) {
        this.id = id;
        this.name = name;
    }
}


export class MapleCharacter extends AbstractMapleCharacter {

    world_id: number;
    account_id: number;
    id: number;
    level: number;
    rank: number;
    rank_move: number;
    job_rank: number;
    job_rank_move: number;
    gender: number;
    face: number;
    hair: number;
    fame: number;
    quest_fame: number;
    initial_spawnpoint: number;
    map_id: number;
    name: string;
    client: MapleClient;
    logged_in: boolean;
    gm_level: number;
    job: MapleJob;
    exp: number;
    gacha_exp: number;
    skin_color: MapleSkinColor;
    pets: Array<MaplePet> = new Array(3);

    is_gm(): boolean {
        return this.gm_level > 0;
    }

    is_gm_job(): boolean {
        return true; // TODO: Needs implementation
    }

    static load_from_db(character_id: number, c: MapleClient, channel_server: boolean): MapleCharacter {
        return null; // TODO: Needs implementation
    }

    generate_character_entry() {
        let ret = new MapleCharacter();
        return ret; // TODO: Needs implementation
    }

    get_remaining_sp() {
        return this._get_remaining_sp(this.job.id);
    }
}