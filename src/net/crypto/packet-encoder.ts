import { Session } from '../server/session';
import { Shanda } from './shanda';


export class MaplePacketEncoder {

    static encode(session: Session, data: Buffer): Buffer {

        let client = session.client;
        let send_crypto = client.send;

        let header = Buffer.from(send_crypto.generate_packet_header(data.length));
        let encrypted = Shanda.encrypt(data.slice(4));
        encrypted = send_crypto.transform(encrypted);
        let ret = Buffer.concat([header, encrypted]);
        return ret;
    }
}