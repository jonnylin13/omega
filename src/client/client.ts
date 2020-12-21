import { Session } from "../net/server/session";
import { DatabaseConnection } from "../util/db";


export class MapleClient {

    static LOGIN = {
        LOGGED_OUT: 0,
        SERVER_TRANSITION: 1,
        LOGGED_IN: 2
    };

    private login_attempt = 0;
    private logged_in = false;
    gm_level: number;
    session: Session;
    private pic: string;
    private pin: string;
    private account_id: number;
    account_name: string;
    gender: number;

    is_logged_in(): boolean {
        return this.logged_in;
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

    async login(user: string, pwd: string, hwid_hex: string): Promise<number> {
        let loginok = 5;
        this.login_attempt++;
        if (this.login_attempt > 4) {
            this.logged_in = false;
            this.session.destroy();
            return 6;
        }

        let res = await DatabaseConnection.knex
            .where({name: user})
            .select('id', 'password', 'gender', 'banned', 'pin', 'pic', 'character_slots', 'tos', 'language')
            .from('accounts');
        
    }

}