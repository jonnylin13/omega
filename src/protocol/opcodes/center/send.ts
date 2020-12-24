

export class CenterSendOpcode {

    static WORKER_HANDSHAKE = new CenterSendOpcode(0x200);
    static PRE_LOGIN_PASSWORD_ACK = new CenterSendOpcode(0x201);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}