import * as net from 'net';
import { Config } from '../../../util/config';
import { PlayerStorage } from '../player-storage';


export class Channel {
    port: number = 7575;
    channel: number;
    world: number;
    id: number;
    socket: net.Socket;
    private players: PlayerStorage = new PlayerStorage();

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

    get_capacity(): number {
        return Math.ceil((this.players.size() / Config.properties.server.channel_load) * 800);
    }

}