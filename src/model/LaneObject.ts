import { GameObject } from "./GameObject";
import { Container } from "pixi.js";
import { LaneGraphics } from "../scenes/game_scene/LaneGraphics";


export class LaneObject extends GameObject {

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