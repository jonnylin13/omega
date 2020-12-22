import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MasterServer } from "../../server";


export class CharListRequestHandler extends AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return true;
    }

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        slea.read_byte();
        let world_id = slea.read_byte();
        let world = MasterServer.get_instance().get_world(world_id);

        if (world == undefined || world.is_capacity_full()) {
            c.announce(LoginPackets.get_server_status(2));
            return;
        }

        let channel_id = slea.read_byte() + 1;
        let channel = world.get_channel(channel_id);
        if (channel == undefined) {
            c.announce(LoginPackets.get_server_status(2));
            return;
        }

        c.world_id = world_id;
        c.channel_id = channel_id;
        c.send_char_list(world_id);
    }
}