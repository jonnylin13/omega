import { CenterServer } from "../centerServer";
import { Database } from "./database";


export class AccountDB {
    static async getPreLoginInfo(username: string) {
        try {
            let records = await Database.knex('accounts')
                .where({name: username})
                .select('id', 'password', 'gender', 'banned', 'pic', 'pin', 'character_slots', 'tos', 'language');
            if (records.length > 0) return records[0];
        } catch (err) {
            CenterServer.instance.logger.error(err.message);
        }
        return undefined;
    }

    static async insertAutoRegisterAccount(username: string, hashedPassword: string) {
        try {
            let results = await Database.knex('accounts')
                .insert({name: username, password: hashedPassword});
            if (results.length > 0) {
                // Success
                let preLoginInfo = await this.getPreLoginInfo(username);
                if (preLoginInfo !== undefined) return preLoginInfo;
                else CenterServer.instance.logger.error(`Could not return preLoginInfo after creating autoregister account for ${username}`);
            }
        } catch (err) {
            CenterServer.instance.logger.error(err.message);
        }
        return undefined;
    }
}