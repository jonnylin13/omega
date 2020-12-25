import { ServerType } from "../baseServer";
import { PacketReader } from "../../protocol/packets/packetReader";
import { ShopServerPacketDelegator } from "./shopServerDelegator";
import { Session } from "../session";
import { Config } from '../../util/config';
import { WorkerServer } from '../workerServer';


export class ShopServer extends WorkerServer {

    static instance: ShopServer;

    constructor() {
        super(ServerType.SHOP, Config.instance.shop.host, Config.instance.shop.port);
        // Establish connection with CenterServer
        this.packetDelegator = new ShopServerPacketDelegator();
        ShopServer.instance = this;
    }

    onConnection(session: Session): void {
        // TODO: Authenticate with one-time generated key
        this.connected = true;
        this.logger.info(`ShopServer has established CenterServer connection`);
    }

    onClose(session: Session, hadError: any): void {
        if (this.isCenterServer(session)) {
            this.connected = false;
            delete this.centerServerSession;
        }
        // TODO: Retry connection ???
    }

    onData(session: Session, data: Buffer): void {

        const packet = new PacketReader(data);
        const opcode = packet.readShort();

        if (this.isCenterServer(session)) {

            const packetHandler = this.packetDelegator.getHandler(opcode);
            if (packetHandler === undefined) {

                this.logger.debug(`ShopServer unhandled packet 0x${opcode.toString(16)} from CenterServer`);
                return;
            }

            this.logger.debug(`ShopServer handling packet 0x${opcode.toString(16)} from CenterServer`);
            packetHandler.handlePacket(packet, this.centerServerSession);
        } else {
            // Potential malicious attack?
        }
    }

    onError(error: any): void {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        this.logger.info(`ShopServer has started listening on port ${this.port}`);
    }

    onShutdown(): void {
        throw new Error("Method not implemented.");
    }

}