import { GameObject } from "./GameObject";


export class ScrollerObject extends GameObject {
    private children: GameObject[];

    constructor(children: GameObject[]) {
        super(null);
        this.children = children;
    }

    setViewportX(viewportX: number) {
        this.viewportX = viewportX;

        this.children.forEach(child => child.setViewportX(viewportX));
    }

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(speed: number) {
        this.viewportX += speed;

        // this.children.forEach(child => child.moveViewportXBy(speed));

        this.setViewportX(this.viewportX);
    }
}