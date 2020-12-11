import { MapleClient } from '../client/client';
import { MasterServer } from './server/server';


export abstract class AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return c.is_logged_in();
    }

    static current_server_time(): number {
        return MasterServer.get_instance().server_current_time;
    }
}