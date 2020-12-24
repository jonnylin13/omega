import { AES } from "./aes";
import { Session } from "../../server/session";
import { Shanda } from "./shanda";


export class EncryptedSession {

    session: Session;
    sendCrypto: AES;
    recvCrypto: AES;

    constructor(session: Session, sendCrypto: AES, recvCrypto: AES) {
        this.sendCrypto = sendCrypto;
        this.recvCrypto = recvCrypto;
        this.session = session;
    }

    async write(data: Buffer): Promise<boolean> {
        const header = this.sendCrypto.generatePacketHeader(data.length);
        this.sendCrypto.transform(data);
        Shanda.encrypt(data);
        return await this.session.write(Buffer.from([...header, ...data]));
    }
}