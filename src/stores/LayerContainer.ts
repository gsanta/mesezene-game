import { AbstractStore } from "./AbstractStore";
import { Container, Application, Graphics } from "pixi.js";
import { SpriteObject } from "../model/SpriteObject";
import { Registry } from "../Registry";

export class Layer {
    id: string;
    range: [number, number]
    container: Container;
    private gameObjects: SpriteObject[] = [];

    constructor(id: string, range: [number, number], application: Application) {
        this.id = id;
        this.range = range;
        this.container = new Container();
        // application.stage.addChild(this.container);
    }

    addChild(gameObject: SpriteObject) {
        this.gameObjects.push(gameObject);
        this.container.addChild(gameObject.container);
    }

    addGraphics(graphics: Graphics) {
        this.container.addChild(graphics);
    }

    removeChild(gameObject: SpriteObject) {
        this.gameObjects = this.gameObjects.filter(go => go !== gameObject);
        this.container.removeChild(gameObject.container);
    }
}


export class LayerContainer {
    layers: Layer[] = [];
    id: string;
    container: Container;

    constructor(id: string, registry: Registry) {
        this.id = id;
        this.container = new Container();
        registry.services.scene.application.stage.addChild(this.container);
    }

    getLayerById(id: string): Layer {
        return this.layers.find(layer => layer.id === id);
    }

    addLayer(layer: Layer) {
        this.container.addChild(layer.container);
        this.layers.push(layer);
    }

    removeAllLayers() {
        this.layers = [];
    }
}