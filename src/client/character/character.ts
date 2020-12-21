import { MapleClient } from "../client";
import { AbstractMapleCharacter } from "./abstract-character";
import { MaplePet } from "./inventory/pet";
import { MapleJob } from "./job";
import { MapleSkinColor } from "./skin-color";


export class MapleCharacter extends AbstractMapleCharacter {

    name: string;
    id: number;
    account_id: number;
    client: MapleClient;
    logged_in: boolean;
    gm_level: number;
    rank: number;
    rank_move: number;
    job_rank: number;
    job_rank_move: number;
    job: MapleJob;
    gender: number;
    face: number;
    hair: number;
    level: number;
    exp: number;
    fame: number;
    gacha_exp: number;
    map_id: number;
    spawn_point: number;
    skin_color: MapleSkinColor;
    pets: Array<MaplePet> = new Array(3);
    world_id: number;

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
}