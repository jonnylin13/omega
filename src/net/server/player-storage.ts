import { MapleCharacter } from '../../client/character';


export class PlayerStorage {
    private storage: Map<number, MapleCharacter> = new Map();
    private name_storage: Map<string, MapleCharacter> = new Map();\

    add_player(chr: MapleCharacter) {
        this.storage.set(chr.id, chr);
        this.name_storage.set(chr.name, chr);
    }

    remove_player(chr: MapleCharacter) {
        this.storage.delete(chr.id);
        this.name_storage.delete(chr.name);
    }

    get_player(query: number | string) {
        if (typeof query === 'number') return this.storage.get(query);
        else return this.name_storage.get(query);
    }

    get_all_players() {
        return this.storage.values();
    }
}