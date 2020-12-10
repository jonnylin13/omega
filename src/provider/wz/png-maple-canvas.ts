import { BufferedImage } from "../img";
import { MapleCanvas } from "../canvas";


export class PNGMapleCanvas implements MapleCanvas {
    height: number;
    width: number;
    data_length: number;
    format: number;
    data: Int8Array;

    constructor(width: number, height: number, data_length: number, format: number, data: Int8Array) {
        this.width = width;
        this.height = height;
        this.data_length = data_length;
        this.format = format;
        this.data = data;
    }

    // TODO: Needs implementation
    get_image(): BufferedImage {
        return new BufferedImage();
    }
}