import { CharNameAndId } from "../../client/character/character";
import { DatabaseConnection, SQLError } from "./db";


export class CharacterDB {

    static async get_character_name_and_id(account_id: number, world_id: number): Promise<Array<CharNameAndId>> {
        let results = DatabaseConnection.knex('characters')
            .where({account_id: account_id, world: world_id})
            .select('id', 'name');
        if (results.length > 0) {
            return results.map((data: any) => new CharNameAndId(data.name, data.id));
        } else return [];
    }
    
}