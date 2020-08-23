import { GraphicsObject } from "../../model/GraphicsObject";
import { gameConfig } from "../../Registry";
import { LaneObject } from "../../model/LaneObject";
import { toHexNumber } from "../menu_scene/MenuScene";

export class LaneGraphics extends GraphicsObject {


    constructor(parent: LaneObject) {
        super(parent)
    }

    draw() {
        const parent = <LaneObject> this.parent;
        // this.graphics.lineStyle(4, 0x424a3f, 1);
        this.graphics.beginFill(toHexNumber(parent.color),1);
        this.graphics.drawRect(0, parent.range[0], gameConfig.width, parent.range[1] - parent.range[0]);
        this.graphics.endFill();
    }

    remove() {
        const index = this.graphics.parent.getChildIndex(this.graphics);
        this.graphics.removeChildAt(index);
    }
}