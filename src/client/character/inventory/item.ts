import { ObjectFlags } from "typescript";
import { Comparable } from "../../../util/comparable";
import { MaplePet } from "./pet";


export class Item implements Comparable<Item> {

    private running_cash_id: number = 777000000;

    id: number;
    private cash_id: number;
    sn: number;
    private position: number;
    quantity: number;
    pet_id: number = -1;
    pet: MaplePet = null;
    owner: string = '';
    log: Array<string>;
    flag: number;
    private expiration: bigint = BigInt(-1);
    gift_from: string = '';

    constructor(id: number, position: number, quantity: number, pet_id?: number) {
        this.id = id;
        this.position = position;
        this.quantity = quantity;
        this.log = [];
        this.flag = 0;
        if (pet_id && pet_id > -1) {
            this.pet = MaplePet.load_from_db(id, position, pet_id);
            if (this.pet == null || this.pet == undefined) pet_id = -1;
        }
        this.pet_id = pet_id;
    }

    copy(): Item {
        let ret = new Item(this.id, this.position, this.quantity, this.pet_id);
        ret.flag = this.flag;
        ret.owner = this.owner;
        ret.expiration = this.expiration;
        ret.log = new Array(...this.log);
        return ret;
    }

    set_position(position: number) {
        this.position = position;
        if (this.pet) this.pet.set_position(position);
    }

    get_cash_id() {
        if (this.cash_id === 0) return this.running_cash_id++;
        return this.cash_id;
    }

    get_item_type(): number {
        return 1; // TODO: Needs implementation
    }

    compare_to(obj: Item): number {
        if (this.id < obj.id) return -1;
        else if (this.id > obj.id) return 1;
        else return 0;
    }

    // TODO: getInventoryType
    // TODO: setFlag
    // TODO: setExpiration
    // TODO: isUntradeable

}