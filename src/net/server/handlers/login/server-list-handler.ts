import { MapleClient } from "../../../../client/client";
import { GameConstants } from "../../../../constants/game/game-constants";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MasterServer } from "../../server";



export class ServerListRequestHandler extends AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return true;
    }

    handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let server = MasterServer.get_instance();
        let worlds = server.worlds;
        c.requested_server_list(worlds.length);

        for (let world of worlds) 
            c.announce(LoginPackets.get_server_list(world.id, GameConstants.WORLD_NAMES[world.id], world.flag, world.event_msg, world.get_channels()));
        
        c.announce(LoginPackets.get_end_of_server_list());
        c.announce(LoginPackets.select_world(0));
        c.announce(LoginPackets.send_recommended(server.world_recommended_list));
        
    }
}