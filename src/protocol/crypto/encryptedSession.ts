import { AES } from "./aes";
import { Session } from "../../server/session";
import { Shanda } from "./shanda";
import { LoginServer } from "../../server/login/loginServer";


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
        Shanda.encrypt(data);
        this.sendCrypto.transform(data);
        return this.session.socket.write(Buffer.concat([header, data]));
    }
}