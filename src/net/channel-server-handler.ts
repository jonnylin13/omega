import { ServerHandler, ServerType } from "./interface/server-handler";
import { PacketDelegator } from "./packet-delegator";
import { Session } from "./server/session";
import * as net from 'net';
import { MapleSessionCoordinator } from "./server/coordinator/session/session-coordinator";


export class ChannelServerHandler implements ServerHandler {

    world_id: number;
    channel_id: number;
    type: ServerType = ServerType.CHANNEL;
    delegator: PacketDelegator;

    constructor(world_id: number, channel_id: number) {
        this.world_id = world_id;
        this.channel_id = channel_id;
        this.delegator = PacketDelegator.get_delegator(this.type);
    }

    close_maple_session(session: Session) {
        MapleSessionCoordinator.get_instance().close_session(session, true);

        let client = session.client;
        if (client != undefined && client != null)
            if (!session.in_transition) 
                client.disconnect(false, false);
            
        session.destroy();
    }

    // TODO: Needs implementation
    on_data(session: Session, data: Buffer): void {

    }

    // TODO: Needs implementation
    on_connection(socket: net.Socket): void {

    }
    // TODO: Needs implementation
    on_disconnect(session: Session, had_error: any): void {

    }

    // TODO: Needs implementation
    on_error(err: any): void {

    }
}