import { System } from "typescript";
import { File } from "../util/structs/file";
import { ServerConfig } from "./interface/serverConfig";


export interface ConfigType {}

export class Properties {
    SERVER: ServerConfig;
    SYSTEM: System;
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