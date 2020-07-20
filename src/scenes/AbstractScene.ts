import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";
import { Application } from "pixi.js";
import { LayerContainer } from "../stores/LayerContainer";
import { GameObjectStore } from "../stores/GameObjectStore";


export abstract class AbstractScene {
    id: string;
    // application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;
    
    spriteStore: GameObjectStore;
    private sceneHtmlElement: HTMLDivElement;

    setup(sceneHtmlElement): void {
        this.sceneHtmlElement = sceneHtmlElement;
    }

    destroy() {
        // this.application.destroy(true);
    }
}