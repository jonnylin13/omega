import { PacketDelegator } from "./packet-delegator";
import { ServerHandler, ServerType } from "./interface/server-handler";
import { MapleSessionCoordinator } from "./server/coordinator/session/session-coordinator";
import { Session } from "./server/session";
import * as net from 'net';
import { MasterServer } from "./server/server";
import { MapleAESOFB } from "./crypto/aes";
import { MapleClient } from "../client/client";
import { LoginPackets } from "../util/packets/login-packets";
import { GenericSeekableLittleEndianAccessor } from "../util/data/input/generic-seekable-lea";
import { ServerConstants } from "../constants/server/server-constants";
const shortid = require('shortid');
import { MaplePacketDecoder } from "./crypto/packet-decoder";


export class LoginServerHandler implements ServerHandler {

    type: ServerType = ServerType.LOGIN;
    delegator: PacketDelegator;

    constructor() {
        this.delegator = PacketDelegator.get_delegator(this.type);
    }

    close_maple_session(session: Session) {
        MapleSessionCoordinator.get_instance().close_login_session(session);

        let client = session.client;
        if (client != undefined && client != null)
            if (!session.in_transition) 
                client.disconnect(false, false);
            
        session.destroy();
    }

    on_connection(socket: net.Socket) {
        MasterServer.get_instance().logger.info(`Login server received a socket connection from ${socket.remoteAddress}`);
        let session = socket as Session;
        session.id = this.assign_id();

        if (!MasterServer.get_instance().started) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }

        if (!MapleSessionCoordinator.get_instance().can_start_login_session(session)) {
            return;
        }

        let iv_recv = Buffer.from([70, 114, 122, 82]);
        let iv_send = Buffer.from([82, 48, 120, 115]);
        iv_recv[3] = Math.random() * 255;
        iv_recv[3] = Math.random() * 255;
        let send_cypher = new MapleAESOFB(iv_send, (0xFFFF - ServerConstants.VERSION));
        let recv_cypher = new MapleAESOFB(iv_recv, (ServerConstants.VERSION));
        let client = new MapleClient(send_cypher, recv_cypher, session);
        // client.announce(LoginPackets.get_hello(ServerConstants.VERSION, iv_send, iv_recv));
        session.write(LoginPackets.get_hello(ServerConstants.VERSION, iv_send, iv_recv));
        session.on('data', (data: Buffer) => this.on_data(session, data));
        session.on('close', had_error => this.on_disconnect(session, had_error));
        session.on('error', err => this.on_error(err));
    }

    on_data(session: Session, data: Buffer) {
        let decrypted = MaplePacketDecoder.decode(session, data);
        if (!decrypted) {
            MasterServer.get_instance().logger.error(`Login server could not decode packet sent from ${session.remoteAddress}`);
            return;
        }
        const slea = new GenericSeekableLittleEndianAccessor(decrypted);
        const packet_id = slea.read_byte();
        const client = session.client;

        const packet_handler = this.delegator.get_handler(packet_id);
        if (packet_handler != null && packet_handler != undefined) {
            packet_handler.handle_packet(slea, client); // TODO: Validate that this works with async calls
        } else {
            // TODO: Handle no packet handler
        }
        client.update_last_packet();
    }

    on_disconnect(session: Session, had_error: any) {
        if (session != null && session != undefined) {
            this.close_maple_session(session);
        }
    }

    on_error(err: any) {
        MasterServer.get_instance().logger.error(err);
    }

    private assign_id(): string {
        return shortid.generate();
    }

}