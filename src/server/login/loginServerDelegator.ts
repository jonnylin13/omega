import { CenterSendOpcode } from "../../protocol/opcodes/center/send";
import { MapleRecvOpcode } from "../../protocol/opcodes/maple/recv";
import { PacketDelegator } from "../baseDelegator";
import { CenterHandshakeHandler } from './handlers/centerHandshakeHandler';
import { PreLoginPasswordAckHandler, PreLoginPasswordHandler } from "./handlers/loginPasswordHandler";


export class LoginServerPacketDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CenterSendOpcode.WORKER_HANDSHAKE.getValue(), new CenterHandshakeHandler());
        this.handlers.set(MapleRecvOpcode.LOGIN_PASSWORD.getValue(), new PreLoginPasswordHandler());
        this.handlers.set(CenterSendOpcode.PRE_LOGIN_PASSWORD_ACK.getValue(), new PreLoginPasswordAckHandler());
    }
    
}