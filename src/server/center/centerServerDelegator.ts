import { PacketDelegator } from "../baseDelegator";
import { LoginSendOpcode } from '../../protocol/opcode/login/send';
import { LoginHandshakeAckHandler } from "./handlers/loginHandshakeAckHandler";

export class CenterServerDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(LoginSendOpcode.CENTER_HANDSHAKE_ACK.getValue(), new LoginHandshakeAckHandler());
    }

}