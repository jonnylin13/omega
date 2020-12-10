import { BufferedImage } from "../img";
import { File } from "./file";
import { MapleCanvas } from '../canvas';
import * as fs from 'fs';


export class FileStoredPNGMapleCanvas implements MapleCanvas {
    file: File;
    width: number;
    height: number;
    image?: BufferedImage;

    constructor(width: number, height: number, file_input: File) {
        this.width = width;
        this.height = height;
        this.file = file_input
    }

    get_image(): BufferedImage {
        this.image = new BufferedImage(this.width, this.height, Buffer.from(fs.readFileSync(this.file.path)));
        return this.image;
    }
}