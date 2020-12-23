import { PacketWriter } from '../../protocol/packet/packetWriter';
import { CommonSendOpcode } from '../../protocol/opcode/common/send';
import { ServerType } from '../baseServer';
import { LoginSendOpcode } from '../../protocol/opcode/login/send';
import { PreLoginClient } from './type/preLoginClient';


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
        packet.writeMapleAsciiString(preLoginClient.password);
        packet.writeMapleAsciiString(preLoginClient.hwidNibbles);
        return packet.getPacket();
    }

}