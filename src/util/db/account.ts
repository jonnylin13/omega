import { DatabaseConnection, SQLError } from "./db";


export class AccountDB {

    static async update_macs(account_id: number, macs: string) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .update({macs: macs}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to update column macs in table accounts: account_id ${account_id}`);
    }

    static async update_hwid(account_id: number, hwid: string) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .update({hwid: hwid}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to update column hwid in table accounts: account_id ${account_id}`);
    }

    static async get_temp_ban(account_id: number) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .select('temp_ban');
        if (results.length > 0) return results[0];
        else throw new SQLError(`No results found for temp_ban: account_id ${account_id}`);
    }

    static async get_ip_ban(remote_address: string) {
        let results = await DatabaseConnection.knex('accounts')
            .where(remote_address, 'like', `CONCAT(ip, '%')`)
            .count({count: '*'});
        if (results.length > 0) return results[0]['COUNT(*)'];
        else throw new SQLError(`Could not retrieve COUNT(*) from table accounts: remote_address ${remote_address}`);
    }

    static async get_mac_bans(macs: Array<string>) {
        let results = await DatabaseConnection.knex('mac_bans')
            .where('mac', 'in', macs.join(', '))
            .count({count: '*'});
        if (results.length > 0) return results[0]['COUNT(*)'];
        else throw new SQLError(`Could not retrieve COUNT(*) from table mac_bans: macs ${macs}`);
    }

    static async update_login_state(account_id: number, new_state: number, timestamp: bigint) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .update({login_state: new_state, last_login: timestamp}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to update login_state and last_login in table accounts: account_id ${account_id}`);
    }

    static async get_login_state(account_id: number) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .select('logged_in', 'last_login', 'birthday');
        if (results.length > 0) return results[0];
        else throw new SQLError(`Could not retrieve login state from table accounts: account_id ${account_id}`);
    }

    static async update_logged_in(account_id: number, logged_in: number) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .update({logged_in: logged_in}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Could not update logged_in from table accounts: account_id ${account_id}`);
    }

    static async get_account_login_info(account_id: number) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .select('id', 'password', 'gender', 'banned', 'pin', 'pic', 'character_slots', 'tos', 'language');
        if (results.length > 0) return results[0];
        else throw new SQLError(`Could not retrieve account login info: account_id ${account_id}`);
    }

    static async create_auto_account(name: string, hashed_password: string) {
        let results = await DatabaseConnection.knex('accounts')
            .insert({name: name, password: hashed_password, birthday: '2018-06-20', temp_ban: '2018-06-20'}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to create a new record in table accounts: name ${name}`);
    }

    static async update_password(account_id: number, hashed_password: string) {
        let results = await DatabaseConnection.knex('accounts')
            .where({id: account_id})
            .update({password: hashed_password}, ['id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to update password in table accounts: account_id ${account_id}`);
    }

    static async update_hwid_accounts(account_id: number, hwid: string, relevance: number, timestamp: bigint) {
        let results = await DatabaseConnection.knex('hwid_accounts')
            .where({account_id: account_id})
            .andWhere('hwid', 'like', `%${hwid}%`)
            .update({
                relevance: relevance,
                expires_at: timestamp
            }, ['account_id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Failed to update hwid_accounts: account_id ${account_id}`);
    }

    static async get_hwid_accounts(account_id: number) {
        let results = await DatabaseConnection.knex('hwid_accounts')
            .where({account_id: account_id})
            .select('SQL_CACHE *');
        if (results.length > 0) return results;
        else throw new SQLError(`Could not retrieve hwid_accounts: account_id ${account_id}`);
    }
    
    static async create_hwid_account(account_id: number, remote_hwid: string, expires_at: bigint) {
        let results = await DatabaseConnection.knex('hwid_accounts')
            .insert({account_id: account_id, remote_hwid: remote_hwid, expires_at: expires_at}, ['account_id']);
        if (results.length > 0) return results[0];
        else throw new SQLError(`Could not create hwid_account: account_id ${account_id}`);
    }

}