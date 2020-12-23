import { AES } from "./aes";
import { Session } from "../../server/session";


export class EncryptedSession {

    sessionId: number;
    sendCrypto: AES;
    recvCrypto: AES;

    constructor(sessionId: number, sendCrypto: AES, recvCrypto: AES) {
        this.sendCrypto = sendCrypto;
        this.recvCrypto = recvCrypto;
        this.sessionId = sessionId;
    }
}