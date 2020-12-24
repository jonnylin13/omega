export class CommonSendOpcode {

    static CENTER_HANDSHAKE_ACK = new CommonSendOpcode(0x400);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}