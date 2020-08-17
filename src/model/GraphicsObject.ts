import { Graphics, Container } from "pixi.js";


export abstract class GraphicsObject {
    graphics: Graphics;

    protected parent: Container;

    constructor(parent: Container) {
        this.parent = parent;
        this.graphics = new Graphics();
    }

    abstract draw();
    abstract remove();
}