import { Session } from "../net/server/session";


export class MapleClient {

    static LOGIN = {
        LOGGED_OUT: 0,
        SERVER_TRANSITION: 1,
        LOGGED_IN: 2
    };

    gm_level: number;
    session: Session;
    pic: string;
    pin: string;
    account_id: number;
    account_name: string;
    gender: number;

    // TODO: Needs implementation
    is_logged_in(): boolean {
        return true;
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

    // TODO
    check_pin(pin: string): boolean {
        return false;
    }

    // TODO
    update_login_state(state: number) {

    }

}