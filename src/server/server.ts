import * as http from 'http';
import { Socket, Server } from 'socket.io';


// Master server
export class MasterServer {

    port: number;
    sockets: Map<string, Socket>;
    started: boolean = false;

    private http_server: http.Server;
    private server: Server;
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
        if (this.http_server || this.server) return;

        this.http_server = http.createServer();
        this.server = new Server(this.http_server);

        this.server.on('connect', socket => this.on_connect(socket))
        this.server.listen(this.port);
        this.started = true;

    }

    stop() {
        if (this.http_server) this.http_server.close();
        if (this.server) this.server.close();
        this.started = false;
        delete this.http_server;
        delete this.server;
    }

    on_connect(socket: Socket) {
        socket.on('disconnect', reason => this.on_disconnect(socket.id, reason));
        this.sockets.set(socket.id, socket);
    }

    on_disconnect(socket_id: string, reason: string) {
        this.sockets.delete(socket_id);
    }

}