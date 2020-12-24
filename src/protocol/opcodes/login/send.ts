export class LoginSendOpcode {

    static PRE_LOGIN_REQUEST = new LoginSendOpcode(0x500);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}