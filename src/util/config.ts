import * as fs from 'fs';
import { File } from '../provider/wz/file';


export class Config {

    static properties: any = {};
    static config_dir: File = new File('config');

    static load() {
        for (let file of this.config_dir.list_files()) {
            let raw_data = fs.readFileSync(file.path);
            this.properties[file.name.split('.')[0]] = JSON.parse(raw_data.toString());
        }
    }

}
Config.load();