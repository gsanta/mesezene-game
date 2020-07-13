import { SpriteObject } from "./SpriteObject";
import { Point } from "pixi.js";


export class ScrollerObject extends SpriteObject {
    private children: SpriteObject[];

    constructor(children: SpriteObject[]) {
        super(null);
        this.children = children;
    }

    addChild(gameObject: SpriteObject) {
        this.children.push(gameObject);
    }

    // setViewportX(viewportX: number) {
    //     this.viewportX = viewportX;

    //     this.children.forEach(child => child.setViewportX(viewportX));
    // }

    move(delta: Point) {
        this.children.forEach(child => child.move(child.speed));
    }
}