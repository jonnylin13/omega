import { BufferedImage } from "./img";


export interface MapleCanvas {
    width: number;
    height: number;
    get_image(): BufferedImage;
}