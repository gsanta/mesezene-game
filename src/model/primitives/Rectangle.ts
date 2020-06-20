

export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    center(): [number, number] {
        return [this.x + this.width / 2, this.y + this.height / 2];
    }

    toString() {
        return `${this.x} ${this.y} ${this.width} ${this.height}`;
    }
}