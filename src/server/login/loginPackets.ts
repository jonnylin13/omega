import { PacketWriter } from '../../protocol/packets/packetWriter';
import { CommonSendOpcode } from '../../protocol/opcodes/common/send';
import { ServerType } from '../baseServer';
import { LoginSendOpcode } from '../../protocol/opcodes/login/send';
import { PreLoginClient } from './types/preLoginClient';
import { MapleSendOpcode } from '../../protocol/opcodes/maple/send';


export class LoginPackets {

    static getCenterHandshakeAck(): Buffer {
        const packet = new PacketWriter(3);
        packet.writeShort(CommonSendOpcode.CENTER_HANDSHAKE_ACK.getValue());
        packet.writeByte(ServerType.LOGIN);
        return packet.getPacket();
    }

    static getLoginHandshake(mapleVersion: number, ivRecv: Buffer, ivSend: Buffer): Buffer {
        const packet = new PacketWriter(16);
        packet.writeShort(14); // Packet length
        packet.writeShort(mapleVersion); // Major version
        packet.writeMapleAsciiString('1'); // Patch string (minor version)
        packet.write(ivRecv);
        packet.write(ivSend);
        packet.writeByte(8); // Locale
        return packet.getPacket();
    }

    static getPreLoginRequest(preLoginClient: PreLoginClient): Buffer {
        const packet = new PacketWriter(2 + preLoginClient.password.length + preLoginClient.username.length + preLoginClient.hwidNibbles.length);
        packet.writeShort(LoginSendOpcode.PRE_LOGIN_REQUEST.getValue());
        packet.writeMapleAsciiString(preLoginClient.username);
        return packet.getPacket();
    }

    static getLoginFailed(reason: number): Buffer {
        const packet = new PacketWriter(8);
        packet.writeShort(MapleSendOpcode.LOGIN_STATUS.getValue());
        packet.writeByte(reason);
        packet.writeByte(0);
        packet.writeInt(0);
        return packet.getPacket();
    }

}