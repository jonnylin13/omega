import { MapleCharacter } from '../../../../client/character/character';
import { MapleClient } from '../../../../client/client';
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
    private pooled_remote_hosts: Set<string>= new Set(); // Seems unnecessary but I'll keep it for now
    private online_remote_hwids: Set<string>= new Set();
    private login_storage: LoginStorage = new LoginStorage();
    private cached_host_hwids: Map<string, string> = new Map();
    private cached_host_timeout: Map<string, bigint> = new Map();
    private sessions: Map<string, Session> = new Map();
    private login_remote_hosts: Map<string, Set<Session>> = new Map();
    private online_clients: Map<number, MapleClient> = new Map();

    static get_instance() {
        if (this.instance === undefined) this.instance = new MapleSessionCoordinator();
        return this.instance;
    }

    get_sessions(): IterableIterator<[string, Session]> {
        return this.sessions.entries();
    }

    get_session(session_id: string): Session {
        return this.sessions.get(session_id);
    }

    open_session(session: Session) {
        this.sessions.set(session.id, session);
    }

    close_session(session: Session, immediately: boolean) {
        // TODO: Needs implementation
    }

    get_game_session_hwid(session: Session) {
        let remote_host = MapleSessionCoordinator.get_remote_host(session);
        return this.cached_host_hwids.get(remote_host);
    }

    can_start_login_session(session: Session): boolean {
        if (!Config.properties.server.deterred_multiclient) return true;
        let remote_host = MapleSessionCoordinator.get_remote_host(session);
        if (this.pooled_remote_hosts.has(remote_host)) return false;
        this.pooled_remote_hosts.add(remote_host);
        let known_hwid = this.cached_host_hwids.get(remote_host);

        if (known_hwid != null && known_hwid != undefined)
            if (this.online_remote_hwids.has(known_hwid)) return false;
        
        let lrh: Set<Session> = new Set();
        lrh.add(session);
        this.login_remote_hosts.set(remote_host, lrh);
        this.pooled_remote_hosts.delete(remote_host);
        return true;
    }

    close_login_session(session: Session) {
        let nibble_hwid = session.client_nibble_hwid;
        let remote_host = MapleSessionCoordinator.get_remote_host(session);
        let lrh = this.login_remote_hosts.get(remote_host);
        if (this.login_remote_hosts.has(remote_host)) {
            lrh.delete(session);
            if (lrh.size === 0) this.login_remote_hosts.delete(remote_host);
        }

        if (this.online_remote_hwids.has(nibble_hwid)) {
            this.online_remote_hwids.delete(nibble_hwid);

            let client = session.client;
            if (client != null && client != undefined) {
                if (this.online_clients.has(client.account_id))
                    this.online_clients.delete(client.account_id);
            }
        }
    }

    private static get_client_in_transition(session: Session): MapleClient {
        let remote_hwid = MapleSessionCoordinator.get_instance().get_game_session_hwid(session);

        if (remote_hwid != undefined && remote_hwid != null) {
            if (remote_hwid.length <= 8) {
                session.client_nibble_hwid = remote_hwid;
            } else {
                session.client_hwid = remote_hwid;
                session.client_nibble_hwid = remote_hwid.substring(remote_hwid.length - 8, remote_hwid.length);
            }

            let client = new MapleClient(null, null, session);
            let character_id = MasterServer.get_instance().free_character_id_in_transition(client);
            if (character_id != undefined && character_id != null) {
                client.account_id = MapleCharacter.load_from_db(character_id, client, false).account_id;
            }

            session.client = client;
            return client;
        }
        return null;
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
            session.client_nibble_hwid = nibble_hwid;
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
            session.client_nibble_hwid = nibble_hwid;
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
        let nibble_hwid = session.client_nibble_hwid;
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
            let nibble_hwid = session.client_nibble_hwid;
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