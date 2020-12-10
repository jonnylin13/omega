


export class BufferedImage {
    width: number;
    height: number;
    data: Buffer;

    constructor(width: number, height: number, data: Buffer) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
}