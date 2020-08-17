import { GraphicsObject } from "../../model/GraphicsObject";
import { gameConfig } from "../../Registry";
import { Container } from "pixi.js";

export class LaneGraphics extends GraphicsObject {

    draw() {
        this.graphics.lineStyle(4, 0x424a3f, 1);
        this.graphics.beginFill(0x000000, 0.5);
        this.graphics.drawRect(0, 0, gameConfig.width, 300);
        this.graphics.endFill();
    }

    remove() {
        const index = this.graphics.parent.getChildIndex(this.graphics);
        this.graphics.removeChildAt(index);
    }
}