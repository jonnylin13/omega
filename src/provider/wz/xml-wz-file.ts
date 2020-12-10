import { File } from "./file";
import { WZDirectoryEntry } from "./wz-directory-entry";
import { WZFileEntry } from "./wz-file-entry";
import * as fs from 'fs';
import { XMLMapleData } from "./xml-maple-data";
import { MapleData } from '../data';
import { MapleDataProvider } from '../data-provider';


export class XMLWZFile implements MapleDataProvider {
    root: WZDirectoryEntry;
    root_file: File;

    constructor(input: File) {
        this.root_file = input; // TODO: Evaluate how this works
        this.root = new WZDirectoryEntry(input.name, 0, 0, null);
        this.fill_maple_data_entities(this.root_file, this.root);
    }

    private fill_maple_data_entities(lroot: File, wz_dir: WZDirectoryEntry): void {
        for (let file of lroot.list_files()) {
            let file_name = file.name;
            if (file.is_directory() && !file_name.endsWith('.img')) {
                let new_dir = new WZDirectoryEntry(file_name, 0, 0, wz_dir);
                wz_dir.add_directory(new_dir);
                this.fill_maple_data_entities(lroot, new_dir);
            } else if (file_name.endsWith('.xml')) {
                wz_dir.add_file(new WZFileEntry(file_name.substring(0, file_name.length - 4), 0, 0, wz_dir));
            }
        }
    }

    get_data(path: string): MapleData {
        let data_file = new File(this.root_file.path + '/' + path + '.xml');
        let image_data_dir = new File(this.root_file.path + '/' + path);
        if (!data_file.exists()) 
            return null; //bitches
        
        let file_buffer = fs.readFileSync(data_file.path);
        let xml_maple_data: XMLMapleData = XMLMapleData.from_string(file_buffer.toString(), image_data_dir.get_parent_file());
        return xml_maple_data;
    }
}