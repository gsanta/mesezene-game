import { GameObject } from "./GameObject";
import { Point } from "pixi.js";


export class ScrollerObject extends GameObject {
    private children: GameObject[];

    constructor(children: GameObject[]) {
        super(null);
        this.children = children;
    }

    addChild(gameObject: GameObject) {
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