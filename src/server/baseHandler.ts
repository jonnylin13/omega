import { PacketReader } from "../protocol/packet/packetReader";
import { Session } from "./session";
import * as net from "net";


export interface PacketHandler {

    handlePacket(packet: PacketReader, session: Session | net.Socket): void;
    
}