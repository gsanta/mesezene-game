import { Point } from "pixi.js";
import Bezier from 'bezier-js';

export class BezierCurve {
    private points: Point[];

    private curve: Bezier;
    private distance: number;
    private dots: Point[];
    private derivatives: Point[];
    private normals: Point[];

    constructor(points: Point[], distance: number) {
        this.points = points;
        this.distance = distance;

        const flatPoints: number[] = [];
        points.forEach(point => flatPoints.push(point.x, point.y));
        this.curve = new Bezier(flatPoints);
    }

    getPoints(): Point[] {
        if (!this.dots) {
            this.createDots();
        }

        return this.dots;
    }

    getDerivatives(): Point[] {
        if (!this.derivatives) {
            this.createDerivatives();
        }

        return this.derivatives;
    }

    getNormals(): Point[] {
        if (!this.normals) {
            this.createNormals();
        }

        return this.normals;
    }

    private createDots() {
        const dotNum = this.curve.length() / this.distance;
        this.dots = [];

        for (let i = 0; i < dotNum; i++) {
            const nextDot = this.curve.get(this.distance * i / this.curve.length());
            this.dots.push(new Point(nextDot.x, nextDot.y));
        }
    }

    private createDerivatives() {
        const dotNum = this.curve.length() / this.distance;
        this.derivatives = [];

        for (let i = 0; i < dotNum; i++) {
            const nextDerivative = this.curve.derivative(this.distance * i / this.curve.length());
            const magnitude = Math.sqrt(nextDerivative.x ** 2 + nextDerivative.y ** 2);
            this.derivatives.push(new Point(nextDerivative.x / magnitude, nextDerivative.y / magnitude));
        }
    }

    private createNormals() {
        const dotNum = this.curve.length() / this.distance;
        this.normals = [];

        for (let i = 0; i < dotNum; i++) {
            const nextNormal = this.curve.normal(this.distance * i / this.curve.length());
            this.normals.push(new Point(nextNormal.x, nextNormal.y));
        }
    }
}