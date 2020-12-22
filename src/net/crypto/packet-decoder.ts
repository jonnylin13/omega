import { MapleClient } from "../../client/client";
import { MapleSessionCoordinator } from "../server/coordinator/session/session-coordinator";
import { Session } from "../server/session";
import { Shanda } from "./shanda";


export class MaplePacketDecoder {

    static decode(session: Session, data: Buffer): Buffer {

        let client: MapleClient = session.client;

        if (client == null || client == undefined) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }

        let recv_crypto = client.receive;
        let block = data.slice(4);
        recv_crypto.transform(block);
        Shanda.decrypt(block);

        // TODO: Validate the packet header ??
        // if (!recv_crypto.check_packet_by_header(packet_header)) {
        //     MapleSessionCoordinator.get_instance().close_session(session, true);
        //     return;
        // }

        return block;
    }    

}