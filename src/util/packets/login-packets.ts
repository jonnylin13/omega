import { MapleClient } from '../../client/client';
import { MaplePacketLittleEndianWriter } from '../data/output/maple-lew';
import { SendOpcode } from '../../net/opcodes/send';
import { MasterServer } from '../../net/server/server';
import { Config } from '../config';
import { Time } from '../time';
import { Convert } from '../convert';
import { Channel } from '../../net/server/channel/channel';
import { Pair } from '../pair';


export class LoginPackets {

    static custom_packet(packet: Int8Array): Buffer {
        const mplew = new MaplePacketLittleEndianWriter();
        mplew.write(packet);
        return mplew.get_packet();
    }

    static get_perma_ban(reason: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(17);
        mplew.write_short(SendOpcode.LOGIN_STATUS.get_value());
        mplew.write_byte(2);
        mplew.write_byte(0);
        mplew.write_int(0);
        mplew.write_byte(0);
        mplew.write_long(Time.get_time(BigInt(-1)));
        return mplew.get_packet();
    }

    static get_temp_ban(timestamp: bigint, reason: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(17);
        mplew.write_short(SendOpcode.LOGIN_STATUS.get_value());
        mplew.write_byte(2);
        mplew.write_byte(0);
        mplew.write_int(0);
        mplew.write_byte(0);
        mplew.write_long(Time.get_time(timestamp));
        return mplew.get_packet();
    }

    // TODO: MaplePacketLEW must dynamically allocate buffers when needed
    static get_auth_success(c: MapleClient): Buffer {
        // Server.getInstance().loadAccountCharacters(c);
        // Server.getInstance().loadAccountStorages(c);
        
        const mplew = new MaplePacketLittleEndianWriter(42 + c.account_name.length);
        mplew.write_short(SendOpcode.LOGIN_STATUS.get_value());
        mplew.write_int(0);
        mplew.write_short(0);
        mplew.write_int(c.account_id);
        mplew.write_byte(c.gender);
        
        let can_fly = MasterServer.get_instance().can_fly(c.account_id);
        mplew.write_bool((Config.properties.server.use_enforce_admin_account || can_fly) ? c.gm_level > 1 : false);    // thanks Steve(kaito1410) for pointing the GM account boolean here
        mplew.write_byte(((Config.properties.server.use_enforce_admin_account || can_fly) && c.gm_level > 1) ? 0x80 : 0);  // Admin Byte. 0x80,0x40,0x20.. Rubbish.
        mplew.write_byte(0); // Country Code.
        
        mplew.write_maple_ascii_string(c.account_name);
        mplew.write_byte(0);
        mplew.write_byte(0); // IsQuietBan
        mplew.write_long(BigInt(0));//IsQuietBanTimeStamp
        mplew.write_long(BigInt(0)); //CreationTimeStamp

        mplew.write_int(1); // 1: Remove the "Select the world you want to play in"
        
        mplew.write_byte(Config.properties.server.enable_pin && !c.can_bypass_pin() ? 0 : 1); // 0 = Pin-System Enabled, 1 = Disabled
        mplew.write_byte(Config.properties.server.enable_pic && !c.can_bypass_pic() ? (c.pic == null || c.pic === '' ? 0 : 1) : 2); // 0 = Register PIC, 1 = Ask for PIC, 2 = Disabled
        
        return mplew.get_packet();
    }

    static get_login_failed(reason: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(8);
        mplew.write_short(SendOpcode.LOGIN_STATUS.get_value());
        mplew.write_byte(reason);
        mplew.write_byte(0);
        mplew.write_int(0);
        return mplew.get_packet();
    }

    static register_pin(): Buffer {
        return this.pin_operation(1);
    }

    static request_pin(): Buffer {
        return this.pin_operation(4);
    }

    static request_pin_after_failure(): Buffer {
        return this.pin_operation(2);
    }

    static pin_accepted(): Buffer {
        return this.pin_operation(0);
    }

    private static pin_operation(mode: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(3);
        mplew.write_short(SendOpcode.CHECK_PINCODE.get_value());
        mplew.write_byte(mode);
        return mplew.get_packet();
    }

    static send_guest_tos(): Buffer {
        const url = 'http://google.com'
        const mplew = new MaplePacketLittleEndianWriter(52 + url.length);
        mplew.write_short(SendOpcode.GUEST_ID_LOGIN.get_value());
        mplew.write_short(0x100);
        mplew.write_int(Math.floor(Math.random() * Math.floor(999999)));
        mplew.write_long(BigInt(0));
        mplew.write_long(BigInt(Time.get_time(BigInt(-2))));
        mplew.write_long(BigInt(Time.get_time(BigInt(new Date().getTime()))));
        mplew.write_int(0);
        mplew.write_maple_ascii_string(url);
        return mplew.get_packet();
    }

    static get_after_login_error(reason: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(8);
        mplew.write_short(SendOpcode.SELECT_CHARACTER_BY_VAC.get_value());
        mplew.write_short(reason);
        return mplew.get_packet();
    }

    static get_server_ip(remote_address: string, port: number, client_id: number): Buffer {
        let addr = Convert.ip_to_bytes(remote_address);
        const mplew = new MaplePacketLittleEndianWriter(15 + addr.length);
        mplew.write_short(SendOpcode.SERVER_IP.get_value());
        mplew.write_short(0);
        mplew.write(addr); // TODO: Needs validation
        mplew.write_short(port);
        mplew.write_int(client_id);
        mplew.write(Int8Array.from([0, 0, 0, 0, 0]));
        return mplew.get_packet();
    }

    static pin_registered(): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(3);
        mplew.write_short(SendOpcode.UPDATE_PINCODE.get_value());
        mplew.write_byte(0);
        return mplew.get_packet();
    }

    static get_relog_response(): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(3);
        mplew.write_short(SendOpcode.RELOG_RESPONSE.get_value());
        mplew.write_byte(1);
        return mplew.get_packet();
    }

    static get_server_status(status: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(4);
        mplew.write_short(SendOpcode.SERVERSTATUS.get_value());
        mplew.write_short(status);
        return mplew.get_packet();
    }

    static get_server_list(server_id: number, server_name: string, flag: number, event_msg: string, channels: Array<Channel>): Buffer {
        let server_payload_size = 11 + server_name.length + event_msg.length;
        let channels_payload_size = (13 + server_name.length) * channels.length;
        const mplew = new MaplePacketLittleEndianWriter(server_payload_size + channels_payload_size);
        mplew.write_short(SendOpcode.SERVERLIST.get_value());
        mplew.write_byte(server_id);
        mplew.write_maple_ascii_string(server_name);
        mplew.write_byte(flag);
        mplew.write_maple_ascii_string(event_msg);
        mplew.write_byte(100);
        mplew.write_byte(0);
        mplew.write_byte(100);
        mplew.write_byte(0);
        mplew.write_byte(0);
        mplew.write_byte(channels.length);
        for (let channel of channels) {
            mplew.write_maple_ascii_string(server_name + '-' + channel.id);
            mplew.write_int(channel.get_capacity());
            mplew.write_int(1);
            mplew.write_byte(channel.id - 1);
            mplew.write_bool(false);
        }
        mplew.write_short(0);
        return mplew.get_packet();
    }

    static get_end_of_server_list(): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(3);
        mplew.write_short(SendOpcode.SERVERLIST.get_value());
        mplew.write_byte(0xFF);
        return mplew.get_packet();
    }

    static select_world(world_id: number): Buffer {
        const mplew = new MaplePacketLittleEndianWriter(6);
        mplew.write_short(SendOpcode.LAST_CONNECTED_WORLD.get_value());
        mplew.write_int(world_id);
        return mplew.get_packet();
    }

    static send_recommended(world_recommended_list: Array<Pair<number, string>>): Buffer {
        let size = 3;
        for (let pair of world_recommended_list) size += 4 + pair.right.length;
        const mplew = new MaplePacketLittleEndianWriter(size);
        mplew.write_short(SendOpcode.RECOMMENDED_WORLD_MESSAGE.get_value());
        mplew.write_byte(world_recommended_list.length);
        for (let pair of world_recommended_list) {
            mplew.write_int(pair.left);
            mplew.write_maple_ascii_string(pair.right);
        }
        return mplew.get_packet();
    }
 
}