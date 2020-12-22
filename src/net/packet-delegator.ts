import { RecvOpcode } from './opcodes/recv';
import { CustomPacketHandler } from './server/handlers/custom-packet-handler';
import { KeepAliveHandler } from './server/handlers/keep-alive-handler';
import { AcceptTOSHandler } from './server/handlers/login/accept-tos-handler';
import { CharListRequestHandler } from './server/handlers/login/char-list-handler';
import { GuestLoginHandler } from './server/handlers/login/guest-login-handler';
import { LoginPasswordHandler } from './server/handlers/login/login-password-handler';
import { PostLoginHandler } from './server/handlers/login/post-login-handler';
import { RegisterPICHandler } from './server/handlers/login/register-pic-handler';
import { RegisterPinHandler } from './server/handlers/login/register-pin-handler';
import { RelogRequestHandler } from './server/handlers/login/relog-handler';
import { ServerListRequestHandler } from './server/handlers/login/server-list-handler';
import { SetGenderHandler } from './server/handlers/login/set-gender-handler';
import { MaplePacketHandler } from './server/handlers/interface/packet-handler';
import { ServerType } from './interface/server-handler';


export class PacketDelegator {

    static instances: Map<string, PacketDelegator> = new Map();
    private handlers: Array<MaplePacketHandler> = [];

    constructor() {
        let max_opcode = 0;
        for (let op of Object.values(RecvOpcode)) {
            if (op.get_value() > max_opcode) {
                max_opcode = op.get_value();
            }
        }
        this.handlers = new Array<MaplePacketHandler>(max_opcode + 1);
    }

    get_handler(packet_id: number) {
        if (packet_id > this.handlers.length) return null;
        let handler = this.handlers[packet_id];
        return handler;
    }

    register_handler(code: RecvOpcode, handler: MaplePacketHandler) {
        this.handlers[code.get_value()] = handler;
    }

    static get_delegator(server_type: ServerType, world?: number, channel?: number) {

        let lolpair = '';

        if (server_type === ServerType.LOGIN)
            lolpair = '-1 -1';
        else 
            lolpair = world + ':' + channel
        
        let delegator = this.instances.get(lolpair);
        if (delegator === undefined) {
            delegator = new PacketDelegator();
            delegator.reset(server_type);
            this.instances.set(lolpair, delegator);
        }
        return delegator;
    }

    reset(server_type: ServerType) {

        this.handlers = [];
        this.register_handler(RecvOpcode.PONG, new KeepAliveHandler());
        this.register_handler(RecvOpcode.CUSTOM_PACKET, new CustomPacketHandler());

        if (server_type === ServerType.LOGIN) {
            // Login server
            this.register_handler(RecvOpcode.ACCEPT_TOS, new AcceptTOSHandler());
            this.register_handler(RecvOpcode.AFTER_LOGIN, new PostLoginHandler());
            this.register_handler(RecvOpcode.SERVERLIST_REREQUEST, new ServerListRequestHandler());
            this.register_handler(RecvOpcode.CHARLIST_REQUEST, new CharListRequestHandler());
            // Character select
            this.register_handler(RecvOpcode.LOGIN_PASSWORD, new LoginPasswordHandler());
            this.register_handler(RecvOpcode.RELOG, new RelogRequestHandler());
            this.register_handler(RecvOpcode.SERVERLIST_REQUEST, new ServerListRequestHandler());
            // Check character name
            // Create character
            // Delete character
            // View all character
            // Pick all character
            this.register_handler(RecvOpcode.REGISTER_PIN, new RegisterPinHandler());
            this.register_handler(RecvOpcode.GUEST_LOGIN, new GuestLoginHandler());
            this.register_handler(RecvOpcode.REGISTER_PIC, new RegisterPICHandler());
            // Character select with PIC
            this.register_handler(RecvOpcode.SET_GENDER, new SetGenderHandler());
            // View all with PIC
            // View all PIC register

        } else if (server_type === ServerType.CHANNEL) {
            // Channel server
        } else if (server_type === ServerType.CASH_SHOP) {
            // Cash shop
        }
    } 

}