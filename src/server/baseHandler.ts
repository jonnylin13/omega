import { PacketReader } from "../protocol/packets/packetReader";
import { Session } from "./session";


export interface PacketHandler {

    handlePacket(packet: PacketReader, session: Session): void;
    
}