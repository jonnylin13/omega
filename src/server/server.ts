import * as http from 'http';
import { Socket, Server } from 'socket.io';
// const socketio = require('socket.io');

// Master server
export class MasterServer {

    // TODO: type declarations
    port: number;
    sockets: Map<string, Socket>;
    started: boolean = false;

    private rawServer: http.Server;
    private server: Server;


    constructor(port=3000) {
        this.port = port;
        this.sockets = new Map();
    }

    start() {
        if (this.rawServer || this.server) return;

        this.rawServer = http.createServer();
        this.server = new Server(this.rawServer);

        this.server.on('connect', socket => this.on_connect(socket))
        this.server.listen(this.port);
        this.started = true;

    }

    stop() {
        if (this.rawServer) this.rawServer.close();
        if (this.server) this.server.close();
        this.started = false;
        delete this.rawServer;
        delete this.server;
    }

    on_connect(socket: Socket) {
        socket.on('disconnect', reason => this.on_disconnect(socket.id, reason));
        this.sockets.set(socket.id, socket);
    }

    on_disconnect(socket_id: string, reason: string) {
        // TODO: Handle other stuff???
        this.sockets.delete(socket_id);
    }

}