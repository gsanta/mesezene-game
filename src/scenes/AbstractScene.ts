import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";
import { Application } from "pixi.js";
import { LayerContainer } from "../stores/LayerContainer";
import { GameObjectStore } from "../stores/GameObjectStore";
import { Registry } from "../Registry";


export abstract class AbstractScene {
    id: string;
    // application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;
    
    spriteStore: GameObjectStore;
    private sceneHtmlElement: HTMLDivElement;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract setup(): void;

    getLayerContainer() {
        return this.registry.stores.layer.getContainer(this.id);
    }

    destroy() {
        // this.application.destroy(true);
    }
}