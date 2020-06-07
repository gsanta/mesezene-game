import { Registry } from "./Registry";
import { Point } from "pixi.js";

function getScreenSize(): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.querySelector('#app > canvas');

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

export class GameWindow {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    
    resize(): void {
        const screenSize = getScreenSize();
        if (screenSize) {
            this.registry.app.pixieApp.renderer.resize(window.innerWidth, window.innerHeight);
        }
    };
}