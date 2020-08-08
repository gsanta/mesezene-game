import { Point } from "pixi.js";


export class LineCalcs {


    shorten(line: [Point, Point], amount: number): [Point, Point] {
        const x1 = line[0].x + 0.1 * (line[1].x - line[0].x);
        const y1 = line[0].y + 0.1 * (line[1].y - line[0].y);

        const x2 = line[0].x + 0.9 * (line[1].x - line[0].x);
        const y2 = line[0].y + 0.9 * (line[1].y - line[0].y);

        return [new Point(x1, y1), new Point(x2, y2)];
    }
}