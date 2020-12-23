

export class CenterSendOpcode {

    static WORKER_HANDSHAKE = new CenterSendOpcode(0x200);

    private code: number;

    constructor(code: number) {
        this.code = code;
    }

    getValue(): number {
        return this.code;
    }
}