import { Database } from "./database";


export class AccountDB {
    static async getPreLoginInfo(username: string) {
        // SELECT id, password, gender, banned, pic, pin, character_slots, tos, language FROM accounts WHERE name = username;
        let records = await Database.knex('accounts')
            .where({name: username})
            .select('id', 'password', 'gender', 'banned', 'pic', 'pin', 'character_slots', 'tos', 'language');
        if (records.length > 0) return records[0];
        else return undefined;
    }
}