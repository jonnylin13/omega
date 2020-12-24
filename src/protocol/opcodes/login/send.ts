export class LoginSendOpcode {

    static PRE_LOGIN = new LoginSendOpcode(0x500);
    static AUTO_REGISTER = new LoginSendOpcode(0x501);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}