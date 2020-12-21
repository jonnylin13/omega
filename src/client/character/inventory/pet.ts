import { Point } from "../../../util/point";
import { MapleCharacter } from "../character";
import { Item } from "./item";

export class PetFlag {

    static OWNER_SPEED = new PetFlag(0x01);

    i: number;

    constructor(i: number) {
        this.i = i;
    }

    get_value() {
        return this.i;
    }
}

export class MaplePet extends Item {
    name: string;
    unique_id: bigint;
    closeness: number = 0;
    level: number = 1;
    fullness: number = 100;
    Fh: number;
    pos: Point;
    stance: number;
    summoned: boolean;
    pet_flag: number;

    constructor(id: number, position: number, unique_id: bigint) {
        super(id, position, 1);
        this.unique_id = unique_id;
        this.pos = new Point(0, 0);
    }

    static load_from_db(item_id: number, position: number, pet_id: number): MaplePet {
        return null; // TODO: Needs implementation
    }

    static delete_from_db(owner: MapleCharacter, pet_id: number) {
        // TODO: Needs implementation
    }

    save_to_db() {
        // TODO: Needs implementation
    }

    static create_pet(item_id: number, level: number, closeness: number, fullness: number) {
        // TODO: Needs implementation
    }

    // TODO: gainClosenessFullness
    // TODO: addPetFlag
    // TODO: removePetFlag
    // TODO: canConsume
    // TODO: updatePosition


}