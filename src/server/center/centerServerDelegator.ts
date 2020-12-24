import { PacketDelegator } from "../baseDelegator";
import { CommonSendOpcode } from '../../protocol/opcodes/common/send';
import { CenterHandshakeAckHandler } from "./handlers/centerHandshakeAckHandler";
import { LoginSendOpcode } from "../../protocol/opcodes/login/send";
import { PreLoginPasswordHandler } from "./handlers/preLoginHandler";
import { AutoRegisterHandler } from "./handlers/autoRegisterHandler";

export class CenterServerDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CommonSendOpcode.CENTER_HANDSHAKE_ACK.getValue(), new CenterHandshakeAckHandler());
        this.handlers.set(LoginSendOpcode.PRE_LOGIN.getValue(), new PreLoginPasswordHandler());
        this.handlers.set(LoginSendOpcode.AUTO_REGISTER.getValue(), new AutoRegisterHandler());
    }

}