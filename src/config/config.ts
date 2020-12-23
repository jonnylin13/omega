import { File } from "../util/structs/file";
import { GameConfig } from "./interface/gameConfig";
import { SystemConfig } from "./interface/systemConfig";


export interface ConfigType {}

export class Properties {
    server: GameConfig;
    system: SystemConfig;
    [key: string]: ConfigType;
}

export class Config {

    static properties: Properties = new Properties();
    static configDirectory: File = new File('config');

    static load() {
        for (const file of this.configDirectory.list()) {
            const data = file.read();
            this.properties[file.name.split('.')[0]] = JSON.parse(data.toString());
        }
    }
}
Config.load();