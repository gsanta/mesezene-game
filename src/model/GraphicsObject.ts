import { Graphics, Container } from "pixi.js";
import { GameObject } from "./GameObject";


export abstract class GraphicsObject {
    graphics: Graphics;

    protected parent: GameObject;

    constructor(parent: GameObject) {
        this.parent = parent;
        this.graphics = new Graphics();
    }

    abstract draw();
    abstract remove();
}