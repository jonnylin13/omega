import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { AntiMultiClientResult, MapleSessionCoordinator } from "../../coordinator/session/session-coordinator";
import { MasterServer } from "../../server";


export class RegisterPICHandler extends AbstractMaplePacketHandler {

    private static parse_anti_multiclient_error(res: AntiMultiClientResult): number {
        switch (res) {
            case AntiMultiClientResult.REMOTE_PROCESSING:
                return 10;
            case AntiMultiClientResult.REMOTE_LOGGED_IN:
                return 7;
            case AntiMultiClientResult.REMOTE_NO_MATCH:
                return 17;
            case AntiMultiClientResult.COORDINATOR_ERROR:
                return 8;
            default:
                return 9;
        }
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        slea.read_byte();
        let character_id = slea.read_int();
        let macs = slea.read_maple_ascii_string();
        let hwid = slea.read_maple_ascii_string();
        if (hwid.match(/[0-9A-F]{12}_[0-9A-F]{8}/).length === 0) {
            c.announce(LoginPackets.get_after_login_error(17));
            return;
        }

        c.update_macs(macs);
        c.update_hwid(hwid);

        let session = c.session;
        let result = MapleSessionCoordinator.get_instance().attempt_game_session(session, c.account_id, hwid);
        if (result !== AntiMultiClientResult.SUCCESS) {
            c.announce(LoginPackets.get_after_login_error(RegisterPICHandler.parse_anti_multiclient_error(result)));
            return;
        }

        if (c.has_banned_mac() || c.has_banned_ip()) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }

        let server = MasterServer.get_instance();
        if (!server.has_character_entry(c.account_id, character_id)) {
            MapleSessionCoordinator.get_instance().close_session(session, true);
            return;
        }

        let pic = slea.read_maple_ascii_string();
        if (c.pic === undefined || c.pic === null || c.pic === '') {
            c.pic = pic;
            c.world_id = server.get_world_id_from_character_id(character_id);
            let world = server.get_world(c.world_id);
            if (world == undefined || world.is_capacity_full()) {
                c.announce(LoginPackets.get_after_login_error(10));
                return;
            }

            server.unregister_login_state(c);
            c.set_character_on_session_transition_state(character_id);
            let addr_info: any = server.get_address(c.world_id, c.channel_id);
            c.announce(LoginPackets.get_server_ip(addr_info.address, addr_info.port, character_id));

        } else MapleSessionCoordinator.get_instance().close_session(session, true);

    }

    validate_state(c: MapleClient): boolean {
        return true;
    }
}