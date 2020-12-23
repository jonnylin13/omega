import { ConfigType } from '../config';


export interface SystemConfig extends ConfigType {
    WZ_PATH: string;
    LOGIN_SERVER_PORT: number;
    NUM_CHANNELS: number;
    CHANNEL_SERVER_STARTING_PORT: number;
}