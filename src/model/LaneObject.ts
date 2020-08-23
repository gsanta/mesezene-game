import { GameObject } from "./GameObject";
import { Container } from "pixi.js";
import { LaneGraphics } from "../scenes/game_scene/LaneGraphics";


export class LaneObject extends GameObject {

    range: [number, number];
    color: string;
    graphics: LaneGraphics;

    constructor(range: [number, number], color: string) {
        super(new Container());

        this.range = range;
        this.color = color;

        this.graphics = new LaneGraphics(this);
        this.addChild(this.graphics);
    }

    isWithinRange(num: number) {
        return num >= this.range[0] && num <= this.range[1];
    }
}