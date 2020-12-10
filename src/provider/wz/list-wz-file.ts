import { GenericLittleEndianAccessor } from "../../util/data/input/generic-lea";
import { LittleEndianAccessor } from "../../util/data/input/interface/lea";
import * as fs from 'fs';
import { File } from './file';
import { WZTool } from './wz-tool';
import { Convert } from '../../util/convert';
import { MapleDataProviderFactory } from "../data-provider-factory";
import { Config } from "../../util/config";


export class ListWZFile {
    lea: LittleEndianAccessor;
    entries: Array<string>;
    static modern_imgs: Set<string>;

    // Unnecessary
    static xor_bytes(a: Int8Array, b: Int8Array): Int8Array {
        return a.map((ai, i) => ai ^ b[i]);
    }

    constructor(list_wz: File) {
        this.lea = new GenericLittleEndianAccessor(fs.readFileSync(list_wz.path));
        while (this.lea.available() > 0) {
            let l = this.lea.read_int() * 2;
            let chunk = new Int8Array(l);
            for (let i = 0; i < chunk.length; i++) 
                chunk[i] = this.lea.read_byte();
            this.lea.read_char();
            let value: string = Convert.buf_to_string(WZTool.read_list_string(chunk));
            this.entries.push(value);
        }
    }

    static init(): void {
        let list_wz_path = Config.properties.system.wzpath;
        if (list_wz_path !== null) {
            let list_wz: ListWZFile = new ListWZFile(MapleDataProviderFactory.file_in_wz_path('List.wz'));
            this.modern_imgs = new Set<string>(list_wz.entries);
        }
    }

    static is_modern_img_file(path: string) {
        return this.modern_imgs.has(path);
    }

}
ListWZFile.init();