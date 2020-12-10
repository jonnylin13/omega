import { WZFileEntry } from "./wz-file-entry";
import { WZIMGEntry } from './wz-img-entry';
import { MapleDataType } from './data-type';
import { WZTool } from './wz-tool';
import { File } from './file';
import * as fs from 'fs';
import { GenericSeekableLittleEndianAccessor } from "../../util/data/input/generic-seekable-lea";
import { SeekableLittleEndianAccessor } from "../../util/data/input/interface/seekable-lea";
import { Point } from "../../util/point";
import { PNGMapleCanvas } from './png-canvas';
import { ImgMapleSound } from './maple-sound';


export class WZIMGFile {
    file: WZFileEntry;
    root: WZIMGEntry;
    provide_images: boolean;
    modern_img: boolean;

    constructor(wz_file: File, file: WZFileEntry, provide_images: boolean, modern_img: boolean) {
        let buffer_from = Buffer.from(fs.readFileSync(wz_file.path));
        let slea = new GenericSeekableLittleEndianAccessor(buffer_from);
        slea.seek(file.offset);
        this.file = file;
        this.provide_images = provide_images;
        this.root = new WZIMGEntry(file.parent);
        this.root.name = file.name;
        this.root.type = MapleDataType.EXTENDED;
        this.modern_img = modern_img;
        this.parse_extended(this.root, slea, 0);
        this.root.finish();
    }

    dump_img(output_buffer: Buffer, slea: SeekableLittleEndianAccessor): void {
        // TODO: Needs implementation
    }

    parse(entry: WZIMGEntry, slea: SeekableLittleEndianAccessor): void {
        let marker = slea.read_byte();
        switch (marker) {
            case 0: {
                let name = WZTool.read_decoded_string(slea);
                entry.name = name;
                break;
            }
            case 1: {
                let name = WZTool.read_decoded_string_at_offset_and_reset(slea, this.file.offset + slea.read_int());
                entry.name = name;
                break;
            }
            default:
                // console.log("Unknown Image identifier: " + marker + " at offset " + (slea.getPosition() - file.getOffset()));
        }
        marker = slea.read_byte();
        switch (marker) {
            case 0:
                entry.type = MapleDataType.IMG_0x00;
                break;
            case 2:
            case 11: //??? no idea, since 0.49
                entry.type = MapleDataType.SHORT;
                entry.data = slea.read_short();
                break;
            case 3:
                entry.type = MapleDataType.INT;
                entry.data = WZTool.read_value(slea);
                break;
            case 4:
                entry.type = MapleDataType.FLOAT;
                entry.data = WZTool.read_float_value(slea);
                break;
            case 5:
                entry.type = MapleDataType.DOUBLE;
                entry.data = slea.read_double();
                break;
            case 8:
                entry.type = MapleDataType.STRING;
                let i_marker = slea.read_byte();
                switch (i_marker) {
                    case 0:
                        entry.data = WZTool.read_decoded_string(slea);
                        break;
                    case 1:
                        entry.data = WZTool.read_decoded_string_at_offset_and_reset(slea, slea.read_int() + this.file.offset);
                        break;
                    default:
                        // console.log(`Unknown String type: ${i_marker}`);
                }
                break;
            case 9:
                entry.type = MapleDataType.EXTENDED;
                let end_of_block  = slea.read_int();
                end_of_block += slea.pos;
                this.parse_extended(entry, slea, end_of_block);
                break;
            default:
                // console.log(`Unknown Image type: ${marker}`);
        }
    }

    parse_extended(entry: WZIMGEntry, slea: SeekableLittleEndianAccessor, end_of_block: number) {
        let marker = slea.read_byte();
        let type;
        switch (marker) {
            case 0x73:
                type = WZTool.read_decoded_string(slea);
                break;
            case 0x1B:
                type = WZTool.read_decoded_string_at_offset_and_reset(slea, this.file.offset + slea.read_int());
                break;
            default:
                // console.log("Unknown extended image identifier: " + marker + " at offset " + (slea.pos - file.offset));
        }
        if (type === 'Property') {
            entry.type = MapleDataType.PROPERTY;
            slea.read_byte();
            slea.read_byte();
            let children = WZTool.read_value(slea);
            for (let i = 0; i < children; i++) {
                let c_entry = new WZIMGEntry(entry);
                this.parse(c_entry, slea);
                c_entry.finish();
                entry.children.push(c_entry);
            }
        } else if (type === 'Canvas') {
            entry.type = MapleDataType.CANVAS;
            slea.read_byte();
            marker = slea.read_byte();
            switch(marker) {
                case 0:
                    break;
                case 1:
                    slea.read_byte();
                    slea.read_byte();
                    let children = WZTool.read_value(slea);
                    for (let i = 0; i < children; i++) {
                        let child = new WZIMGEntry(entry);
                        this.parse(child, slea);
                        child.finish();
                        entry.children.push(child);
                    }
                    break;
                default:
                    console.log(`Canvas marker !== 1 (${marker})`);
                    break;
            }
            let width = WZTool.read_value(slea);
            let height = WZTool.read_value(slea);
            let format = WZTool.read_value(slea);
            let format2 = WZTool.read_value(slea);
            slea.read_int();
            let data_length = slea.read_int() - 1;
            slea.read_byte();
            if (this.provide_images) {
                let png_data = slea.read(data_length);
                entry.data = new PNGMapleCanvas(width, height, data_length, format + format2, png_data);
            } else {
                entry.data = new PNGMapleCanvas(width, height, data_length, format + format2, null);
                slea.skip(data_length);
            }
        } else if (type === 'Shape2D#Vector2D') {
            entry.type = MapleDataType.VECTOR;
            let x = WZTool.read_value(slea);
            let y = WZTool.read_value(slea);
            entry.data = new Point(x, y);
        } else if (type === 'Shape2D#Convex2D') {
            let children = WZTool.read_value(slea);
            for (let i = 0; i < children; i++) {
                let c_entry = new WZIMGEntry(entry);
                this.parse_extended(c_entry, slea, 0);
                c_entry.finish();
                entry.children.push(c_entry);
            }
        } else if (type === 'Sound_DX8') {
            entry.type = MapleDataType.SOUND;
            slea.read_byte();
            let data_length = WZTool.read_value(slea);
            WZTool.read_value(slea); // Skip
            let offset = slea.pos;
            entry.data = new ImgMapleSound(data_length, offset - this.file.offset);
            slea.seek(end_of_block);
        } else if (type === 'UOL') {
            entry.type = MapleDataType.UOL;
            slea.read_byte(); // Skip
            let uol_marker = slea.read_byte();
            switch (uol_marker) {
                case 0:
                    entry.data = WZTool.read_decoded_string(slea);
                    break;
                case 1:
                    entry.data = WZTool.read_decoded_string_at_offset_and_reset(slea, this.file.offset + slea.read_int());
                    break;
                default:
                    // console.log("Unknown UOL marker: " + uol_marker + " " + entry.name);
            }
        } else {
            // console.log('Unhandled extended type: ' + type);
        }
    }


}