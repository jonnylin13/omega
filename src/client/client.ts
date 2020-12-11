import { Session } from "../net/server/session";


export class MapleClient {

    gm_level: number;
    session: Session;

    // TODO: Needs implementation
    is_logged_in(): boolean {
        return true;
    }

    // TODO: Needs implementation
    get_gm_level(): number {
        return 1;
    }

    announce(packet: Int8Array) {
        this.session.write(Buffer.from(packet));
    }

}