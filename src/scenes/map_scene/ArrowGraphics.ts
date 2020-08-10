import { BezierCurve } from "../../utils/BezierCurve";
import { Graphics, Point } from "pixi.js";
import { toHexNumber } from "../menu_scene/MenuScene";
import { Line } from "../../model/primitives/Line";
import { BadgeGraphics } from "./BadgeGraphics";
import { MapScene } from "./MapScene";
import { LineCalcs } from "../../utils/LineCalcs";

export interface ArrowGraphicsConfig {
    lineColorHex: string;
    dashWidth: number;
    strokeWidth: number;
}

export class ArrowGraphics {
    private bezier: BezierCurve;
    private graphics: Graphics = new Graphics();

    private readonly arrowConfig: ArrowGraphicsConfig;
    private line: Line;
    private startBadge: BadgeGraphics;
    private endBadge: BadgeGraphics;
    private mapScene: MapScene;
    private layerId: string;

    constructor(scene: MapScene, startBadge: BadgeGraphics, endBadge: BadgeGraphics, layerId: string, arrowConfig: ArrowGraphicsConfig) {
        this.mapScene = scene;
        this.startBadge = startBadge;
        this.endBadge = endBadge;
        this.layerId = layerId;

        this.line = this.createLine();
        this.bezier = this.createBezierCurve();
        this.arrowConfig = arrowConfig;
    }

    private createLine() {
        const startBadgeSprite = this.mapScene.spriteStore.getByName(this.startBadge.spriteId)[0];
        const endBadgeSprite = this.mapScene.spriteStore.getByName(this.endBadge.spriteId)[0];

        const line = new LineCalcs().shorten(new Line(new Point(...startBadgeSprite.getDimensions().center()), new Point(...endBadgeSprite.getDimensions().center())));
        return line;
    }

    private createBezierCurve(): BezierCurve {
        let pControl: Point;

        if (this.line.p1.x < this.line.p2.x) {
            const x = this.line.p2.x - 100;
            const y = this.line.p2.y - 100;
            pControl = new Point(x, y);
        } else {
            const x = this.line.p2.x + 100;
            const y = this.line.p2.y - 100;
            pControl = new Point(x, y);        
        }

        return new BezierCurve([this.line.p1, pControl, this.line.p2], 80);
    }

    draw(): Graphics {
        this.graphics.lineStyle(4, toHexNumber(this.arrowConfig.lineColorHex), 1);
        this.drawArrow();

        this.mapScene.getLayerContainer().getLayerById(this.layerId).addGraphics(this.graphics);

        return this.graphics;
    }

    update() {
        this.graphics.clear();
        this.graphics.removeChildren();
        this.drawArrow();
    }

    private drawArrow() {
        const points = this.bezier.getPoints();
        const derivatives = this.bezier.getNormalizedDerivatives();
        const normals = this.bezier.getNormals();

        const dashLines = points.map((point, index) => this.getDashLine(point, derivatives[index]));
        const lastLine = dashLines[dashLines.length - 1];
        const arrowHeadLines = this.getArrowHeadLines(lastLine.p2, lastLine.p1, normals[normals.length - 1]);

        dashLines.forEach((line, i) => this.graphics.drawPolygon(this.lineToPolygon(line, normals[i])));
        this.graphics.drawPolygon([arrowHeadLines[0].p1, arrowHeadLines[0].p2, arrowHeadLines[0].p2, arrowHeadLines[0].p1]);
        this.graphics.drawPolygon([arrowHeadLines[1].p1, arrowHeadLines[1].p2, arrowHeadLines[1].p2, arrowHeadLines[1].p1]);
    }

    private getDashLine(centerPoint: Point, derivative: Point): Line {
        const offsetX = this.arrowConfig.dashWidth / 2 * derivative.x;
        const offsetY = this.arrowConfig.dashWidth / 2 * derivative.y;

        const cx1 = centerPoint.x - offsetX;
        const cx2 = centerPoint.x + offsetX;
        const cy1 = centerPoint.y - offsetY;
        const cy2 = centerPoint.y + offsetY;
        return new Line(new Point(cx1, cy1), new Point(cx2, cy2));        
    }

    private lineToPolygon(line: Line, normal: Point): Point[] {
        const offsetX = this.arrowConfig.strokeWidth / 2 * normal.x;
        const offsetY = this.arrowConfig.strokeWidth / 2 * normal.y;

        const [x1, y1] = [line.p1.x - offsetX, line.p1.y - offsetY];
        const [x2, y2] = [line.p2.x - offsetX, line.p2.y - offsetY];
        const [x3, y3] = [line.p2.x + offsetX, line.p2.y + offsetY];
        const [x4, y4] = [line.p1.x + offsetX, line.p1.y + offsetY];

        return [new Point(x1, y1), new Point(x2, y2), new Point(x3, y3), new Point(x4, y4)];
    }

    private getArrowHeadLines(headPoint: Point, tailPoint: Point, normal: Point): [Line, Line] {
        const width = 30;
        const cp1 = new Point(tailPoint.x - width * normal.x, tailPoint.y - width * normal.y);
        const cp2 = new Point(tailPoint.x + width * normal.x, tailPoint.y + width * normal.y);

        return [new Line(headPoint, cp1), new Line(headPoint, cp2)];
    }
}