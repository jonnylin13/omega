import { MapleClient } from "../../../../client/client";
import { SeekableLittleEndianAccessor } from "../../../../util/data/input/interface/seekable-lea";
import { LoginPackets } from "../../../../util/packets/login-packets";
import { AbstractMaplePacketHandler } from "../../../abstract-packet-handler";
import { MasterServer } from "../../server";


export class ServerStatusRequestHandler extends AbstractMaplePacketHandler {

    validate_state(c: MapleClient): boolean {
        return true;
    }

    async handle_packet(slea: SeekableLittleEndianAccessor, c: MapleClient) {
        let world_id = slea.read_short();
        let world = MasterServer.get_instance().get_world(world_id);
        if (world !== undefined) {
            let status = world.get_capacity_status();
            c.announce(LoginPackets.get_server_status(status));
        } else c.announce(LoginPackets.get_server_status(2));
    }

}