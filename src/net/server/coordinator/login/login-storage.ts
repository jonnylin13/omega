import { Config } from "../../../../util/config";
import { MasterServer } from "../../server";


export class LoginStorage {
    private login_history: Map<number, Array<bigint>> = new Map();

    register_login(account_id: number): boolean {
        let account_history = this.login_history.get(account_id);
        if (account_history === undefined) {
            account_history = [];
            this.login_history.set(account_id, account_history);
        }

        if (account_history.length > Config.properties.server.max_account_login_attempts) {
            let block_expiration = MasterServer.get_instance().get_current_time() + BigInt(Config.properties.server.login_attempt_duration);
            account_history.fill(block_expiration);
            return false;
        }
        account_history.push(MasterServer.get_instance().get_current_time() + BigInt(Config.properties.server.login_attempt_duration));
        return true;
    }

    update_login_history() {
        let time_now = MasterServer.get_instance().get_current_time();
        let to_remove: Array<number> = [];
        let to_remove_attempt: Array<bigint> = [];

        for (let [account_id, account_history] of this.login_history.entries()) {
            to_remove_attempt = [];

            for (let login_attempt of account_history) 
                if (login_attempt < time_now) to_remove_attempt.push(login_attempt);
            
            if (to_remove_attempt.length !== 0) {
                for (let tr_attempt of to_remove_attempt)
                    account_history.splice(account_history.indexOf(tr_attempt), 1);

                if (account_history.length === 0)
                    to_remove.push(account_id);
            }
            
        }
        for (let tr of to_remove)
            this.login_history.delete(tr);
    }
}