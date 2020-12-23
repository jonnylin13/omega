export class LoginRecvOpcode {

    static CENTER_HANDSHAKE = new LoginRecvOpcode(0x00);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}