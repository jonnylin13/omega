

export class CenterSendOpcode {

    static WORKER_HANDSHAKE = new CenterSendOpcode(0x00);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}