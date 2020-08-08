import { BezierCurve } from "../../utils/BezierCurve";
import { Graphics, Point } from "pixi.js";

export class ArrowGraphics {
    private bezier: BezierCurve;
    private graphics: Graphics = new Graphics();

    private readonly rectWidth = 30;
    private readonly rectHeight = 3;

    constructor(bezier: BezierCurve) {
        this.bezier = bezier;
    }

    draw(): Graphics {
        this.graphics.lineStyle(4, 0xff0000, 1);
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
        const derivatives = this.bezier.getDerivatives();
        const normals = this.bezier.getNormals();

        const lines = points.map((point, index) => {
            return this.drawRect(point, derivatives[index], normals[index]);
            // this.graphics.drawCircle(point.x, point.y, 3);
        });

        const lastLine = lines[lines.length - 1];
        this.drawArrowHead(lastLine[1], lastLine[0], normals[normals.length - 1]);
    }

    private drawRect(centerPoint: Point, derivative: Point, normal: Point): [Point, Point]
    {
        const ratio = derivative.y / derivative.x;
        const cx1 = centerPoint.x - this.rectWidth / 2 * derivative.x;
        const cx2 = centerPoint.x + this.rectWidth / 2 * derivative.x;
        const cy1 = centerPoint.y - this.rectWidth / 2 * derivative.y;
        const cy2 = centerPoint.y + this.rectWidth / 2 * derivative.y;
        const line: [Point, Point] = [new Point(cx1, cy1), new Point(cx2, cy2)];

        this.graphics.drawPolygon(this.lineToPolygon(line, normal));
        // this.graphics.draw(centerPoint.x - 5, centerPoint.y - 2, 15, 3);
        
        return line;
    }

    private lineToPolygon(line: [Point, Point], normal: Point): Point[] {

        const [x1, y1] = [line[0].x - this.rectHeight / 2 * normal.x, line[0].y - this.rectHeight / 2 * normal.y];
        const [x2, y2] = [line[1].x - this.rectHeight / 2 * normal.x, line[1].y - this.rectHeight / 2 * normal.y];
        const [x3, y3] = [line[1].x + this.rectHeight / 2 * normal.x, line[1].y + this.rectHeight / 2 * normal.y];
        const [x4, y4] = [line[0].x + this.rectHeight / 2 * normal.x, line[0].y + this.rectHeight / 2 * normal.y];

        return [new Point(x1, y1), new Point(x2, y2), new Point(x3, y3), new Point(x4, y4)];
    }

    private drawArrowHead(headPoint: Point, tailPoint: Point, normal: Point) {
        const width = 30;
        const cP1 = [tailPoint.x - width * normal.x, tailPoint.y - width * normal.y];
        const cP2 = [tailPoint.x + width * normal.x, tailPoint.y + width * normal.y];

        this.graphics.drawPolygon([headPoint, new Point(cP1[0], cP1[1]), new Point(cP1[0], cP1[1]), headPoint]);
        this.graphics.drawPolygon([headPoint, new Point(cP2[0], cP2[1]), new Point(cP2[0], cP2[1]), headPoint]);
    }
}