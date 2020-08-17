import { SpriteObject } from "./SpriteObject";
import { Container } from "pixi.js";
import { LaneGraphics } from "../scenes/game_scene/LaneGraphics";


export class LaneObject extends SpriteObject {

    range: [number, number];
    graphics: LaneGraphics;

    constructor(range: [number, number]) {
        super(new Container());

        this.range = range;

        this.graphics = new LaneGraphics(this.container);
        this.addChild(this.graphics);
    }

    isWithinRange(num: number) {
        return num >= this.range[0] && num <= this.range[1];
    }
}