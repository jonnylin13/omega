import { PacketHandler } from "./baseHandler";


export abstract class PacketDelegator {

    protected handlers: Map<number, PacketHandler> = new Map();

    constructor() {
        this.init();
    }

    getHandler(opcode: number): PacketHandler {
        return this.handlers.get(opcode);
    }

    abstract init(): void;
}