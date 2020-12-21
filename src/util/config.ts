import * as fs from 'fs';
import { File } from '../provider/wz/file';

interface SystemConfig extends ConfigType {
    wzpath: string;
}

interface ServerConfig extends ConfigType {
    time_update_interval: number;
    use_enforce_admin_account: boolean;
    enable_pic: boolean;
    enable_pin: boolean;
    use_ip_validation: boolean;
    local_server: boolean;
    automatic_register: boolean;
    bcrypt_migration: boolean;
    deterred_multiclient: boolean;
    max_account_login_attempts: number;
    login_attempt_duration: number;
    max_allowed_account_hwid: number;
    use_character_account_check: boolean;
    channel_load: number;
    collective_charslot: boolean;
}

interface ConfigType {}

class Properties {
    server: ServerConfig;
    system: SystemConfig;
    [key: string]: ConfigType;
}


export class Config {

    static properties: Properties = new Properties();
    static config_dir: File = new File('config');

    static load() {
        for (let file of this.config_dir.list_files()) {
            let raw_data = fs.readFileSync(file.path);
            this.properties[file.name.split('.')[0]] = JSON.parse(raw_data.toString());
        }
    }

}
Config.load();