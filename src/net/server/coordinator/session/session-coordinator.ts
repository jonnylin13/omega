import { Config } from '../../../../util/config';
import { AccountDB } from '../../../../util/db/account';
import { MasterServer } from '../../server';
import { Session } from '../../session';
import { LoginStorage } from '../login/login-storage';

export enum AntiMultiClientResult {
    SUCCESS,
    REMOTE_LOGGED_IN,
    REMOTE_REACHED_LIMIT,
    REMOTE_PROCESSING,
    REMOTE_NO_MATCH,
    MANY_ACCOUNT_ATTEMPTS,
    COORDINATOR_ERROR
}

export class MapleSessionCoordinator {

    static instance: MapleSessionCoordinator;
    sessions: Map<string, Session>;
    private pooled_remote_hosts: Set<string>;
    private online_remote_hwids: Set<string>;
    private login_storage: LoginStorage = new LoginStorage();
    private cached_host_hwids: Map<string, string>;
    private cached_host_timeout: Map<string, bigint>;

    static get_instance() {
        if (this.instance === undefined) this.instance = new MapleSessionCoordinator();
        return this.instance;
    }

    constructor() {
        this.sessions = new Map();
        this.pooled_remote_hosts = new Set();
        this.online_remote_hwids = new Set();
    }

    close_session(session: Session, immediately: boolean) {
        // TODO: Needs implementation
    }

    private static hwid_expiration_update(relevance: number): bigint {
        let degree = 1, i = relevance, subdegree;
        while((subdegree = 5 * degree) <= i) {
            i -= subdegree;
            degree++;
        }
        degree--;
        let base_time, subdegree_time;
        if (degree > 2) subdegree_time = 10;
        else subdegree_time = 1 + (3 * degree);

        switch (degree) {
            case 0:
                base_time = 2; // 2 hours
                break;
            case 1:
                base_time = 24; // 1 day
                break;
            case 2:
                base_time = 168; // 7 days
                break;
            default:
                base_time = 1680; // 70 days
        }
        return (BigInt(3600000) * BigInt(base_time + subdegree_time));
    }

    private static async update_access_account(hwid: string, account_id: number, relevance: number) {
        let timestamp = MasterServer.get_instance().get_current_time() + this.hwid_expiration_update(relevance);
        if (relevance < 127) // Max value of a byte ??
            relevance++;

        try {
            await AccountDB.update_hwid_accounts(account_id, hwid, relevance, timestamp);
        } catch (err) {
            // TODO: Handle SQL error
        }
    }

    private static async attempt_access_account(nibble_hwid: string, account_id: number, routine_check: boolean): Promise<boolean> {
        
        let hwid_count = 0;
        try {
            let rows = await AccountDB.get_hwid_accounts(account_id);
            for (let data of rows) {
                let hwid = data.hwid;
                if (hwid.endsWith(nibble_hwid)) {
                    if (!routine_check) {
                        let relevance = data.relevance;
                        await this.update_access_account(hwid, account_id, relevance);
                    }
                    return true;
                }
                hwid_count++;
            }
        } catch (err) {
            // TODO: Handle error
            return false;
        }
        if (hwid_count < Config.properties.server.max_allowed_account_hwid) return true;
        return false;

    }

    async attempt_login_session(session: Session, nibble_hwid: string, account_id: number, routine_check: boolean): Promise<AntiMultiClientResult> {
        if (!Config.properties.server.deterred_multiclient) {
            session.nibble_hwid = nibble_hwid;
            return AntiMultiClientResult.SUCCESS;
        }

        let remote_host = MapleSessionCoordinator.get_remote_host(session);
        try {
            // TODO: Multithreading ???
            if (this.pooled_remote_hosts.has(remote_host)) 
                return AntiMultiClientResult.REMOTE_PROCESSING;
            this.pooled_remote_hosts.add(remote_host);
        } catch(error) {
            return AntiMultiClientResult.COORDINATOR_ERROR;
        }

        if (!this.login_storage.register_login(account_id)) 
            return AntiMultiClientResult.MANY_ACCOUNT_ATTEMPTS;

        if (!routine_check) {
            if (this.online_remote_hwids.has(nibble_hwid)) return AntiMultiClientResult.REMOTE_LOGGED_IN;
            let attempt_access_account = await MapleSessionCoordinator.attempt_access_account(nibble_hwid, account_id, routine_check);
            if (!attempt_access_account) return AntiMultiClientResult.REMOTE_REACHED_LIMIT;
            session.nibble_hwid = nibble_hwid;
            this.online_remote_hwids.add(nibble_hwid);
        } else {
            let attempt_access_account = await MapleSessionCoordinator.attempt_access_account(nibble_hwid, account_id, routine_check);
            if (!attempt_access_account) return AntiMultiClientResult.REMOTE_REACHED_LIMIT;
        }
        this.pooled_remote_hosts.delete(remote_host);
        return AntiMultiClientResult.SUCCESS;
        
    }

    private register_remote_host_hwid(remote_host: string, remote_hwid: string) {
        this.cached_host_hwids.set(remote_host, remote_hwid);
        this.cached_host_timeout.set(remote_host, MasterServer.get_instance().get_current_time() + BigInt(604800000));
    }

    private async register_access_account(remote_hwid: string, account_id: number) {
        try {
            await AccountDB.create_hwid_account(account_id, remote_hwid, MasterServer.get_instance().get_current_time() + MapleSessionCoordinator.hwid_expiration_update(0));
        } catch (err) {
            // TODO: Handle error
        }
    }

    private async register_hwid_account_if_absent(remote_hwid: string, account_id: number) {
        try {
            let rows = await AccountDB.get_hwid_accounts(account_id);
            let hwid_count = 0;
            for (let data of rows) {
                if (remote_hwid == data.hwid) return false;
                hwid_count++;
            }
            if (hwid_count < Config.properties.server.max_allowed_account_hwid) {
                await this.register_access_account(remote_hwid, account_id);
                return true;
            }
        } catch (err) {
            // TODO: Handle error
        }
        
        return false;
    }

    static get_remote_host(session: Session) {
        let nibble_hwid = session.nibble_hwid;
        if (nibble_hwid) return session.remoteAddress + '-' + nibble_hwid;
        else return session.remoteAddress;
    }

    attempt_game_session(session: Session, account_id: number, remote_hwid: string): AntiMultiClientResult {
        let remote_host = MapleSessionCoordinator.get_remote_host(session);
        if (!Config.properties.server.deterred_multiclient) {
            this.register_remote_host_hwid(remote_host, remote_hwid);
            this.register_remote_host_hwid(session.remoteAddress, remote_hwid);
            return AntiMultiClientResult.SUCCESS;
        }

        if (this.pooled_remote_hosts.has(remote_host)) return AntiMultiClientResult.REMOTE_PROCESSING;
        this.pooled_remote_hosts.add(remote_host);
        try {
            let nibble_hwid = session.nibble_hwid;
            if (nibble_hwid) {
                this.online_remote_hwids.delete(nibble_hwid);
                if (remote_hwid.endsWith(nibble_hwid)) {
                    if (!this.online_remote_hwids.has(remote_hwid)) {
                        this.online_remote_hwids.add(remote_hwid);
                        this.register_remote_host_hwid(remote_host, remote_hwid);
                        this.register_remote_host_hwid(session.remoteAddress, remote_hwid);
                        this.register_hwid_account_if_absent(remote_hwid, account_id);
                        return AntiMultiClientResult.SUCCESS;
                    } else return AntiMultiClientResult.REMOTE_LOGGED_IN;
                } else return AntiMultiClientResult.REMOTE_NO_MATCH;
            } else return AntiMultiClientResult.REMOTE_NO_MATCH;
        } finally {
            this.pooled_remote_hosts.delete(remote_host);
        }

    }



}