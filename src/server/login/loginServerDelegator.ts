import { CenterSendOpcode } from "../../protocol/opcode/center/send";
import { MapleRecvOpcode } from "../../protocol/opcode/maple/recv";
import { PacketDelegator } from "../baseDelegator";
import { CenterHandshakeHandler } from './handlers/centerHandshakeHandler';
import { PreLoginPasswordHandler } from "./handlers/loginPasswordHandler";


export class LoginServerPacketDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CenterSendOpcode.WORKER_HANDSHAKE.getValue(), new CenterHandshakeHandler());
        this.handlers.set(MapleRecvOpcode.LOGIN_PASSWORD.getValue(), new PreLoginPasswordHandler());
    }
    
}