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
        const packet = new PacketWriter(18);
        packet.writeShort(14); // Packet length
        packet.writeShort(mapleVersion); // Major version
        packet.writeMapleAsciiString('1'); // Patch string (minor version)
        packet.write(ivRecv);
        packet.write(ivSend);
        packet.writeByte(8); // Locale
        return packet.getPacket();
    }

    static getPreLoginRequest(preLoginClient: PreLoginClient): Buffer {
        const packet = new PacketWriter(8 + preLoginClient.username.length);
        packet.writeShort(LoginSendOpcode.PRE_LOGIN.getValue());
        packet.writeInt(preLoginClient.sessionId);
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

    static getAutoRegister(sessionId: number, username: string, hashedPassword: string): Buffer {
        const packet = new PacketWriter(10 + username.length + hashedPassword.length);
        packet.writeShort(LoginSendOpcode.AUTO_REGISTER.getValue());
        packet.writeInt(sessionId);
        packet.writeMapleAsciiString(username);
        packet.writeMapleAsciiString(hashedPassword);
        return packet.getPacket();
    }

    static getAuthSuccess(): Buffer {
        return null; // TODO
    }

}