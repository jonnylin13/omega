import * as net from 'net';
import { MapleClient } from '../../client/client';
import { Config } from '../../util/config';
import { MapleSessionCoordinator } from './coordinator/session/session-coordinator';
const shortid = require('shortid');
import { Session } from './session';
import { World } from './world/world';


// Master server
export class MasterServer {

    port: number;
    started: boolean = false;
    // current_time: number = 0; // BigInt here?
    server_current_time: bigint = BigInt(0);
    uptime: bigint = BigInt(new Date().getTime());

    worlds: Array<World> = [];

    private server: net.Server;
    private static instance: MasterServer = null;

    private in_login_state: Map<MapleClient, bigint> = new Map();
    private transitioning_characters: Map<string, number> = new Map();
    private account_characters: Map<number, Set<number>> = new Map();
    private world_characters: Map<number, number> = new Map();

    static get_instance(): MasterServer {
        return this.instance;
    }

    constructor(port=3000) {
    }

    start() {
        if (this.server && this.started) return;

        this.server = net.createServer();
        this.server.on('connection', socket => this.on_connect(socket))
        this.server.listen(this.port);
        this.started = true;

    }

    stop() {
        if (this.server) {
            this.server.close();
            for (let session of MapleSessionCoordinator.get_instance().sessions.values()) session.destroy();
            // TODO: Should be using socket.end()?
        }
        this.started = false;
        delete this.server;
    }

    private on_connect(socket: net.Socket) {
        
        let session = (socket as Session);
        session.id = this.assign_id();
        socket.on('data', (data: Buffer) => this.on_data(session.id, data));
        socket.on('close', had_error => this.on_disconnect(session.id, had_error));
        MapleSessionCoordinator.get_instance().sessions.set(session.id, session);
    }

    private assign_id(): string {
        return shortid.generate();
    }

    private on_data(socket_id: string, data: Buffer) {
        // TODO: Needs implementation
    }

    private on_disconnect(socket_id: string, had_error: boolean) {
        MapleSessionCoordinator.get_instance().sessions.delete(socket_id);
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

}