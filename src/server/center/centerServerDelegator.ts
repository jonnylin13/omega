import { PacketDelegator } from "../baseDelegator";
import { CommonSendOpcode } from '../../protocol/opcode/common/send';
import { CenterHandshakeAckHandler } from "./handlers/centerHandshakeAckHandler";

export class CenterServerDelegator extends PacketDelegator {

    init(): void {
        this.handlers.set(CommonSendOpcode.CENTER_HANDSHAKE_ACK.getValue(), new CenterHandshakeAckHandler());
    }

}