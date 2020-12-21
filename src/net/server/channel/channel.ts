import * as net from 'net';


export class Channel {
    port: number = 7575;
    channel: number;
    world: number;
    id: number;
    socket: net.Socket;

    constructor(world: number, channel: number, start_time: number) {
        this.world = world;
        this.channel = channel;
        this.port = this.channel - 1;
    }

    // TODO: Needs implementation
    shutdown(): void {

    }

    // TODO: Needs implementation
    can_uninstall(): boolean {
        return false;
    }

}