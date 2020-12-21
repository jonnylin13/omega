import * as net from 'net';
import { MapleClient } from '../../client/client';
import { Config } from '../../util/config';
import { Pair } from '../../util/pair';
import { MapleServerHandler } from '../maple-server-handler';
import { MapleSessionCoordinator } from './coordinator/session/session-coordinator';
import { Session } from './session';
import { World } from './world/world';


// Master server
export class MasterServer {

    port: number;
    started: boolean = false;
    // current_time: number = 0; // bigint here?
    server_current_time: bigint = BigInt(0);
    uptime: bigint = BigInt(new Date().getTime());

    worlds: Array<World> = [];

    private server: net.Server;
    private static instance: MasterServer = null;
    private maple_server_handler: MapleServerHandler = new MapleServerHandler();

    private in_login_state: Map<MapleClient, bigint> = new Map();
    private transitioning_characters: Map<string, number> = new Map();
    private account_characters: Map<number, Set<number>> = new Map();
    private world_characters: Map<number, number> = new Map();
    world_recommended_list: Array<Pair<number, string>> = [];

    static get_instance(): MasterServer {
        return this.instance;
    }

    constructor(port=3000) {
    }

    start() {
        if (this.server && this.started) return;

        this.server = net.createServer();
        this.server.on('connection', socket => this.maple_server_handler.on_connection(socket))
        this.server.listen(this.port);
        this.started = true;

    }

    stop() {
        if (this.server) {
            this.server.close();
            // for (let session of MapleSessionCoordinator.get_instance().sessions.values()) session.destroy();
            // TODO: Should be using socket.end()?
        }
        this.started = false;
        delete this.server;
    }

    get_current_time(): bigint {
        return (this.server_current_time) - (this.uptime);
    }

    update_current_time() {
        this.server_current_time += BigInt(Config.properties.server.time_update_interval);
    }

    force_update_current_time(): bigint {
        let time_now = BigInt(new Date().getTime());
        this.server_current_time = time_now;
        return time_now;
    }

    // TODO: Needs implementation
    can_fly(account_id: number): boolean {
        return false;
    }
    
    register_login_state(c: MapleClient) {
        this.in_login_state.set(c, BigInt(new Date().getUTCMilliseconds() + 600000));
    }

    unregister_login_state(c: MapleClient) {
        this.in_login_state.delete(c);
    }

    has_character_in_transition(c: MapleClient): boolean {
        if (Config.properties.server.use_ip_validation) return true;
        let remote_ip = c.session.remoteAddress;
        return this.transitioning_characters.has(remote_ip);
    }

    has_character_entry(account_id: number, character_id: number): boolean {
        let acc_chars = this.account_characters.get(account_id);
        return acc_chars.has(character_id);
    }

    get_world_id_from_character_id(character_id: number): number {
        let world_id = this.world_characters.get(character_id);
        return world_id != undefined ? world_id : -1;
    }

    get_world(world_id: number): World {
        return this.worlds[world_id];
    }

    get_address(world_id: number, channel_id: number) {
        return this.worlds[world_id].get_channel(channel_id).socket.address;
    }

    set_character_id_in_transition(c: MapleClient, character_id: number) {
        let remote_host = MapleSessionCoordinator.get_remote_host(c.session);
        this.transitioning_characters.set(remote_host, character_id);
    }

    free_character_id_in_transition(c: MapleClient): number {
        if (Config.properties.server.use_ip_validation) return null;
        let remote_host = MapleSessionCoordinator.get_remote_host(c.session);
        if (this.transitioning_characters.has(remote_host)) {
            let character_id = this.transitioning_characters.get(remote_host);
            this.transitioning_characters.delete(remote_host);
            return character_id;
        } else return null;
    }

}