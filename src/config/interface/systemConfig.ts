import { ConfigType } from '../config';


export interface SystemConfig extends ConfigType {
    WZ_PATH: string;
    USE_WORKER_THREADS: boolean;
}