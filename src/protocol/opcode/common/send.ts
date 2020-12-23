export class CommonSendOpcode {

    static CENTER_HANDSHAKE_ACK = new CommonSendOpcode(0x300);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}