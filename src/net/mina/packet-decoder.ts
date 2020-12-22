import { MapleClient } from "../../client/client";
import { MapleSessionCoordinator } from "../server/coordinator/session/session-coordinator";
import { Session } from "../server/session";
import { MapleCustomEncryption } from "./crypto";


export class MaplePacketDecoder {

    static decode(session: Session, data: Buffer): Buffer {
        let client: MapleClient = session.client;
        if (client == null || client == undefined) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }
        let recv_crypto = client.receive;
        let packet_header = data.readInt32LE();
        console.log(packet_header);
        if (!recv_crypto.check_packet_by_header(packet_header)) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }
        // console.log(packet_header);
        let decrypted = recv_crypto.encrypt(data.slice(4, data.length));
        decrypted = MapleCustomEncryption.decrypt(decrypted);
        return decrypted;
    }    

}