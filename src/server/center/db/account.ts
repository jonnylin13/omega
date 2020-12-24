import { LoginServer } from "../../login/loginServer";
import { Database } from "./database";


export class AccountDB {
    static async getPreLoginInfo(username: string) {
        // SELECT id, password, gender, banned, pic, pin, character_slots, tos, language FROM accounts WHERE name = username;
        try {
            let records = await Database.knex
                .where({name: username})
                .select('id', 'password', 'gender', 'banned', 'pic', 'pin', 'character_slots', 'tos', 'language')
                .from('accounts');
            if (records.length > 0) return records[0];
            else return undefined;
        } catch (err) {
            LoginServer.logger.error(err);
        }
    }
}