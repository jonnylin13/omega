

export class MapleSkinColor {

    static NORMAL = new MapleSkinColor(0);
    static DARK = new MapleSkinColor(1);
    static BLACK = new MapleSkinColor(2);
    static PALE = new MapleSkinColor(3);
    static BLUE = new MapleSkinColor(4);
    static GREEN = new MapleSkinColor(5);
    static WHITE = new MapleSkinColor(9);
    static PINK = new MapleSkinColor(10);

    id: number;

    constructor(id: number) {
        this.id = id;
    }
}