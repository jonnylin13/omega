import { MapleClient } from '../client/client';
import { MasterServer } from './server/server';


export abstract class AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return c.logged_in;
    }

    static current_server_time(): bigint {
        return MasterServer.get_instance().server_current_time;
    }
}