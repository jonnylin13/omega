import { MapleClient } from '../client/client';


export abstract class AbstractMaplePacketHandler {
    validate_state(c: MapleClient): boolean {
        return c.is_logged_in();
    }

    // TODO: Needs implementation
    static current_server_time(): number {
        return 1;
    }
}