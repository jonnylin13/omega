import { PacketWriter } from '../../protocol/packets/packetWriter';
import { CommonSendOpcode } from '../../protocol/opcodes/common/send';
import { ServerType } from '../baseServer';
import { LoginSendOpcode } from '../../protocol/opcodes/login/send';
import { PreLoginClient } from './types/preLoginClient';
import { MapleSendOpcode } from '../../protocol/opcodes/maple/send';
import { LoginClient } from './types/loginClient';
import { Config } from '../../util/config';


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

    static getAuthSuccess(loginClient: LoginClient): Buffer {
        const packet = new PacketWriter(42 + loginClient.name.length);
        packet.writeShort(MapleSendOpcode.LOGIN_STATUS.getValue());
        packet.writeInt(0);
        packet.writeShort(0);
        packet.writeInt(loginClient.id);
        packet.writeByte(loginClient.gender);
        
        const canFly = true; // TODO

        // (Config.instance.game.enforceAdminAccount || canFly) ? loginClient.gm > 1 : 
        packet.writeBoolean(false);
        // ((Config.instance.game.enforceAdminAccount || canFly) && loginClient.gm > 1) ? 0x80 : 
        packet.writeByte(0);
        packet.writeByte(0); // Country Code.
        
        packet.writeMapleAsciiString(loginClient.name);
        packet.writeByte(0);
        
        packet.writeByte(0); // IsQuietBan
        packet.writeLong(BigInt(0));//IsQuietBanTimeStamp
        packet.writeLong(BigInt(0)); //CreationTimeStamp

        packet.writeInt(1); // 1: Remove the "Select the world you want to play in"
        
        packet.writeByte(Config.instance.game.enablePin ? 0 : 1); // 0 = Pin-System Enabled, 1 = Disabled
        packet.writeByte(Config.instance.game.enablePic ? ((loginClient.pic === null || loginClient.pic === undefined || loginClient.pic === '') ? 0 : 1) : 2); // 0 = Register PIC, 1 = Ask for PIC, 2 = Disabled
        
        return packet.getPacket();
    }

    static addLogin(accountId: number): Buffer {
        const packet = new PacketWriter(6);
        packet.writeShort(LoginSendOpcode.ADD_LOGIN.getValue());
        packet.writeInt(accountId);
        return packet.getPacket();
    }

}