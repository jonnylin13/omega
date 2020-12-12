import { Session } from "../net/server/session";


export class MapleClient {

    gm_level: number;
    session: Session;
    pic: string;
    account_id: number;
    account_name: string;
    gender: number;

    // TODO: Needs implementation
    is_logged_in(): boolean {
        return true;
    }

    // TODO: Needs implementation
    get_gm_level(): number {
        return 1;
    }

    // TODO: Needs implementation
    pong_received(): void {
        
    }

    announce(packet: Buffer) {
        this.session.write(packet);
    }

    // TODO: Needs implementation
    disconnect(a: boolean, b: boolean) {
        
    }

    // TODO: Needs implementation
    accept_tos(): boolean {
        return true;
    }

    // TODO: Needs implementation
    finish_login(): number {
        return 1;
    }

    // TODO
    can_bypass_pin(): boolean {
        return false;
    }

    // TODO
    can_bypass_pic(): boolean {
        return false;
    }

}