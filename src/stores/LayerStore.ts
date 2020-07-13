import { AbstractStore } from "./AbstractStore";
import { Container, Application } from "pixi.js";
import { SpriteObject } from "../model/SpriteObject";

export class Layer {
    id: string;
    range: [number, number]
    private container: Container;
    private gameObjects: SpriteObject[] = [];

    constructor(id: string, range: [number, number], application: Application) {
        this.id = id;
        this.range = range;
        this.container = new Container();
        application.stage.addChild(this.container);
    }

    addChild(gameObject: SpriteObject) {
        this.gameObjects.push(gameObject);
        this.container.addChild(gameObject.sprite);
    }

    removeChild(gameObject: SpriteObject) {
        this.gameObjects = this.gameObjects.filter(go => go !== gameObject);
        this.container.removeChild(gameObject.sprite);
    }
}


export class LayerStore extends AbstractStore {
    layers: Layer[] = [];

    getLayerById(id: string): Layer {
        return this.layers.find(layer => layer.id === id);
    }

    addLayer(layer: Layer) {
        this.layers.push(layer);
    }
}