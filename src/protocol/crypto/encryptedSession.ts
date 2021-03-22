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
        const encPacket = await this.createMaplePacket(data);
        console.log(encPacket.toString('hex').match(/../g).join(' '));
        return this.session.socket.write(encPacket);
    }

    private async createMaplePacket(data: Buffer): Promise<Buffer> {
        const header = this.sendCrypto.createPacketHeader(data.length);
        Shanda.encrypt(data);
        this.sendCrypto.transform(data);
        const encPacket = Buffer.concat([header, data]);
        return encPacket;
    }
}