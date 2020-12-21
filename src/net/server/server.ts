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

}