import { CenterSendOpcode } from "../../protocol/opcode/center/send";
import { PacketDelegator } from "../baseDelegator";
import { CenterHandshakeHandler } from './handlers/centerHandshakeHandler';


export class LoginServerPacketDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CenterSendOpcode.WORKER_HANDSHAKE.getValue(), new CenterHandshakeHandler());
    }
    
}