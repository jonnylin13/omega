import { PacketDelegator } from "./packet-delegator";
import { ServerHandler } from "./server-handler";
import { MapleSessionCoordinator } from "./server/coordinator/session/session-coordinator";
import { Session } from "./server/session";
import * as net from 'net';
const shortid = require('shortid');


export class MapleServerHandler implements ServerHandler {

    world_id: number;
    channel__id: number;
    delegator: PacketDelegator;

    constructor(world_id: number = -1, channel_id: number = -1) {
        this.world_id = world_id;
        this.channel__id = channel_id;
        this.delegator = PacketDelegator.get_delegator(world_id, channel_id);
    }

    is_login_server_handler() {
        return this.world_id === -1 && this.channel__id === -1;
    }

    close_maple_session(session: Session) {
        if (this.is_login_server_handler())
            MapleSessionCoordinator.get_instance().close_login_session(session);
        else MapleSessionCoordinator.get_instance().close_session(session, false);

        let client = session.client;
        if (client != undefined && client != null)
            if (!session.in_transition) 
                client.disconnect(false, false);
            
        session.destroy();
    }

    on_connection(socket: net.Socket) {
        let session = socket as Session;
        session.id = this.assign_id();
        socket.on('data', (data: Buffer) => this.on_data(session.id, data));
        socket.on('close', had_error => this.on_disconnect(session.id, had_error));
    }

    on_data(session_id: string, data: Buffer) {
        
    }

    on_disconnect(session_id: string, had_error: any) {
        let session = MapleSessionCoordinator.get_instance().get_session(session_id);
        if (session != null && session != undefined) {
            this.close_maple_session(session);
        }
        if (had_error) {
            // TODO: Handle error
        }
    }

    private assign_id(): string {
        return shortid.generate();
    }

}