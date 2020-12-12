import * as net from 'net';
import { Config } from '../../util/config';
const shortid = require('shortid');
import { Session } from './session';


// Master server
export class MasterServer {

    port: number;
    sockets: Map<string, Session>;
    started: boolean = false;
    // current_time: number = 0; // BigInt here?
    server_current_time: number = 0;
    uptime: number = new Date().getTime();

    private server: net.Server;
    private static instance: MasterServer = null;

    static get_instance(): MasterServer {
        if (this.instance === null) this.instance = new MasterServer();
        return this.instance;
    }

    constructor(port=3000) {
        this.port = port;
        this.sockets = new Map();
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
            for (let socket of this.sockets.values()) socket.destroy(); // TODO: Should be using socket.end()?
        }
        this.started = false;
        delete this.server;
    }

    private on_connect(socket: net.Socket) {
        
        let id_socket = (socket as Session);
        id_socket.id = this.assign_id();
        socket.on('data', (data: Buffer) => this.on_data(id_socket.id, data));
        socket.on('close', had_error => this.on_disconnect(id_socket.id, had_error));
        this.sockets.set(id_socket.id, id_socket);
    }

    private assign_id(): string {
        return shortid.generate();
    }

    private on_data(socket_id: string, data: Buffer) {
        // TODO: Needs implementation
    }

    private on_disconnect(socket_id: string, had_error: boolean) {
        this.sockets.delete(socket_id);
    }

    get_current_timestamp() {
        return this.server_current_time - this.uptime;
    }

    update_current_time() {
        this.server_current_time += Config.properties.server.time_update_interval;
    }

    force_update_current_time() {
        let time_now = new Date().getTime();
        this.server_current_time = time_now;
        return time_now;
    }

    // TODO: Needs implementation
    can_fly(account_id: number): boolean {
        return false;
    }

}