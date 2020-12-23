import { AES } from "../protocol/crypto/aes";
import { Session } from "../server/session";


export class Client {
    session: Session;
    id: number;
    sendCrypto: AES;
    recvCrypto: AES;

    constructor(sendCrypto: AES, recvCrypto: AES, session: Session) {
        this.sendCrypto = sendCrypto;
        this.recvCrypto = recvCrypto;
        this.session = session;
    }
}