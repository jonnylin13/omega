import { File } from "./types/file";
const Hjson = require('hjson');


export class Config {

    [key: string]: any;

    static configDir = new File('config');
    static instance: Config;

    static init() {
        this.instance = this;
        for (let configFile of this.configDir.list()) {
            const fileName = configFile.name.split('.')[0];
            const configObj = Hjson.parse(configFile.read().toString('utf-8'));
            this.instance[fileName] = configObj;
        }
    }
    
}
Config.init();