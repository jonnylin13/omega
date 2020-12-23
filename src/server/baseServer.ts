import { PacketDelegator } from "./baseDelegator";
import * as winston from 'winston';

export interface BaseServer {
    packetDelegator: PacketDelegator;
}

export const WINSTON_FORMAT = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
);

export enum ServerType {
    CENTER, LOGIN, CHANNEL
}