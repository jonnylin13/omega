export class LoginSendOpcode {

    static CENTER_HANDSHAKE_ACK = new LoginSendOpcode(0x00);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}