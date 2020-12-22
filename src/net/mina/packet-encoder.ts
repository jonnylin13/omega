import { Session } from '../server/session';
import { MapleCustomEncryption } from './crypto';


export class MaplePacketEncoder {

    static encode(session: Session, data: Buffer): Buffer {
        let client = session.client;
        let send_crypto = client.send;
        let unencrypted = Buffer.from(data);
        let header = Buffer.from(send_crypto.get_packet_header(unencrypted.length));
        let encrypted = MapleCustomEncryption.encrypt(unencrypted);
        encrypted = send_crypto.encrypt(encrypted);
        let ret = Buffer.concat([header, encrypted]);
        return ret;
    }
}