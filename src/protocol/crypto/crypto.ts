import * as crypto from "crypto"

export class Crypto {

    static generateIv(): Buffer {
        return crypto.randomBytes(4);
    }

}