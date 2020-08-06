import { BezierCurve } from "../../utils/BezierCurve";
import { Graphics } from "pixi.js";

export class ArrowGraphics {
    private bezier: BezierCurve;
    private graphics: Graphics = new Graphics();

    constructor(bezier: BezierCurve) {
        this.bezier = bezier;
    }

    draw(): Graphics {
        this.graphics.lineStyle(4, 0x424a3f, 1);
        this.drawArrow();

        return this.graphics;
    }

    update() {
        this.graphics.clear();
        this.graphics.removeChildren();
        this.drawArrow();
    }

    private drawArrow() {
        const points = this.bezier.getPoints();

        points.forEach(point => {
            this.graphics.drawCircle(point.x, point.y, 3);
        });
    }
}