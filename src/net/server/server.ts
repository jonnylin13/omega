import * as net from 'net';
const shortid = require('shortid');


class Socket extends net.Socket {
    id: string;
}


// Master server
export class MasterServer {

    port: number;
    sockets: Map<string, Socket>;
    started: boolean = false;

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
        
        let id_socket = (socket as Socket);
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

}