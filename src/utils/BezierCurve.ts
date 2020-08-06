import { Point } from "pixi.js";
import Bezier from 'bezier-js';

export class BezierCurve {
    private points: Point[];

    private curve: Bezier;
    private distance: number;
    private dots: Point[];

    constructor(points: Point[], distance: number) {
        this.points = points;
        this.distance = distance;

        const flatPoints: number[] = [];
        points.forEach(point => flatPoints.push(point.x, point.y));
        this.curve = new Bezier(flatPoints);
        
        const dots = this.curve.length() / distance;
    }

    private createDots() {
        const dots = this.curve.length() / this.distance;
        const lut = this.curve.getLUT(dots);
        this.dots = [];

        for (let i = 0; i < lut.length; i += 2) {
            this.dots.push(new Point(lut[i].x, lut[i].y));
        }
    }

    getPoints(): Point[] {
        if (!this.dots) {
            this.createDots();
        }

        return this.dots;
    }
}