import { Point } from "pixi.js";
import { Line } from "../model/primitives/Line";


export class LineCalcs {


    shorten(line: Line): Line {
        const x1 = line.p1.x + 0.1 * (line.p2.x - line.p1.x);
        const y1 = line.p1.y + 0.1 * (line.p2.y - line.p1.y);

        const x2 = line.p1.x + 0.9 * (line.p2.x - line.p1.x);
        const y2 = line.p1.y + 0.9 * (line.p2.y - line.p1.y);

        return new Line(new Point(x1, y1), new Point(x2, y2));
    }
}