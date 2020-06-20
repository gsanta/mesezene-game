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

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(speed: number) {
        this.viewportX += speed;

        // this.children.forEach(child => child.moveViewportXBy(speed));

        // this.setViewportX(this.viewportX);
    }

    move(delta: Point) {
        this.children.forEach(child => child.move(child.speed));
        console.log(this.children[2].sprite.position.x)
    }
}