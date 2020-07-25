import { Graphics, Point } from "pixi.js";
import { Registry } from "../../Registry";


export class MenuItemGraphics {

    private readonly LINES = 6;
    private readonly PADDING_X = 10;
    private readonly LINE_DIST = 12;

    private readonly len: number;
    position: Point;


    constructor(position: Point, len: number) {
        this.position = new Point(position.x, position.y);
        this.len = len;
    }

    draw(): Graphics {
        return this.drawMenuItem();
    }


    private drawMenuItem() {
        const LINES = 6;
        const PADDING_X = 10;
        const LINE_DIST = 12;

        const graphics = new Graphics();
        graphics.lineStyle(4, 0x424a3f, 1);

        const startY = this.position.y;
        for (let i = 0; i < LINES; i++) {
            // graphics.beginFill(0xffffff, 0.4);
            graphics.lineStyle(1, 0xffffff, 0.7);
            graphics.drawRect(this.position.x + PADDING_X, this.position.y, this.len - PADDING_X * 2, 1);
            this.position.y += LINE_DIST;
        }

        graphics.lineStyle(3, 0xffffff, 0.7);
        graphics.drawRect(this.position.x + PADDING_X, startY + 1, 1, (LINES - 1) * LINE_DIST - 1);
        graphics.drawRect(this.position.x + this.len - PADDING_X, startY + 1, 1, (LINES - 1) * LINE_DIST - 1);
        // graphics.endFill();
        return graphics;
    }
}