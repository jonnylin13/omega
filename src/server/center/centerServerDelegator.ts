import { PacketDelegator } from "../baseDelegator";
import { CommonSendOpcode } from '../../protocol/opcode/common/send';
import { LoginHandshakeAckHandler } from "./handlers/loginHandshakeAckHandler";

export class CenterServerDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CommonSendOpcode.CENTER_HANDSHAKE_ACK.getValue(), new LoginHandshakeAckHandler());
    }

}