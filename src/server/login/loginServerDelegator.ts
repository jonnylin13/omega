import { LoginRecvOpcode } from "../../protocol/opcode/login/recv";
import { PacketDelegator } from "../baseDelegator";
import { CenterHandshakeHandler } from './handlers/centerHandshakeHandler';


export class LoginServerPacketDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(LoginRecvOpcode.CENTER_HANDSHAKE.getValue(), new CenterHandshakeHandler());
    }
    
}