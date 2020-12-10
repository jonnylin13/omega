import { MapleDataProvider } from './data-provider';
import { File } from './wz/file';
import * as fs from 'fs';
import { WZFile } from './wz/wz-file';


export class MapleDataProviderFactory {
    static wz_path: string = ''; // TODO: Set up config to set wz_path

    static get_wz(file: File, provide_images: boolean): MapleDataProvider {
        if (file.name.endsWith('wz') && !fs.lstatSync(file.path).isDirectory()) {
            return new WZFile(file, provide_images);
        } else {
            return new WZFile(file, null);
        }
    }

    // TODO: Finish implementing
}