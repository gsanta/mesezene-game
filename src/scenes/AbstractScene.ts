import { Registry } from "../Registry";
import { GameObjectStore } from "../stores/GameObjectStore";
import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";

export enum SceneState {
    Loading = 'Loading',
    Ready = 'Ready',
    Running = 'Running',
    Stopped = 'Stopped',
    Destroyed = 'Destroyed'
}

export abstract class AbstractScene {
    id: string;
    // application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;

    private hidden = false;
    
    spriteStore: GameObjectStore;
    private sceneHtmlElement: HTMLDivElement;
    protected registry: Registry;
    protected sceneJson: AppJson;

    constructor(registry: Registry, sceneJson: AppJson) {
        this.registry = registry;
        this.sceneJson = sceneJson;
    }

    state: SceneState = SceneState.Destroyed;

    getLayerContainer() {
        return this.registry.stores.layer.getContainer(this.id);
    }

    getState() {
        return this.state;
    }

    stop() {
        this.state = SceneState.Stopped;
    }

    destroy() {
        this.state = SceneState.Destroyed;
        // this.spriteStore.getAll().forEach(spriteObject => spriteObject.destroy());
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        this.doDestroy();
        // this.application.destroy(true);
    }

    load() {
        this.state = SceneState.Loading;
        this.loader.load(this.sceneJson)
            .then(() => {
                this.state = SceneState.Ready;
                this.doInit();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    update() {
        if (this.state === SceneState.Running) {
            this.doUpdate();
        }
    }

    hide() {
        this.getLayerContainer().container.visible = false;
        this.hidden = true;
    }

    show() {
        // if (this.state !== SceneState.Hidden) { throw new Error(`'show()' can only be applied to a hidden scene, current state is: ${this.state}`); }

        this.getLayerContainer().container.visible = true;
        this.hidden = false;
    }

    isHidden() {
        return this.hidden;
    }

    protected abstract doInit();
    protected abstract doUpdate();
    protected abstract doDestroy();
}