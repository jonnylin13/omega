

export class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Seriously unnecessary
    get_location(): Point {
        return this;
    }

    set_location(point: Point): void {
        this.x = point.x;
        this.y = point.y;
    }
}