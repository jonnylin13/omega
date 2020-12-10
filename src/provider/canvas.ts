import { BufferedImage } from "./img";


export interface MapleCanvas {
    height: number;
    width: number;
    get_image: BufferedImage;
}