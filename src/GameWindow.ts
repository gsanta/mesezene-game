import { Registry } from "./Registry";
import { Point, Sprite } from "pixi.js";
import { GameScript } from "./model/GameScript";

function getScreenSize(htmlElement: HTMLElement): Point {
    if (typeof document !== 'undefined') {

        if (htmlElement) {
            const rect: ClientRect = htmlElement.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

export class GameWindow extends GameScript {
    htmlElement: HTMLElement;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }
    
    resize(): void {
        const screenSize = getScreenSize(this.htmlElement);
        if (screenSize) {
            // this.registry.services.loader.application.renderer.resize(1000, 500);
        }
    };
}