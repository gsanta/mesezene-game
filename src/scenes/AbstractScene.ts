import { Registry } from "../Registry";
import { GameObjectStore } from "../stores/GameObjectStore";
import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";

export enum SceneStateLegacy {
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

    state: SceneStateLegacy = SceneStateLegacy.Destroyed;

    getLayerContainer() {
        return this.registry.stores.layer.getContainer(this.id);
    }

    getState() {
        return this.state;
    }

    stop() {
        this.state = SceneStateLegacy.Stopped;
    }

    destroy() {
        this.state = SceneStateLegacy.Destroyed;
        // this.spriteStore.getAll().forEach(spriteObject => spriteObject.destroy());
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        this.doDestroy();
        // this.application.destroy(true);
    }

    load() {
        this.state = SceneStateLegacy.Loading;
        this.loader.load(this.sceneJson)
            .then(() => {
                this.state = SceneStateLegacy.Ready;
                this.doInit();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    update() {
        if (this.state === SceneStateLegacy.Running) {
            this.doUpdate();
        }
    }

    run() {
        this.state = SceneStateLegacy.Running;
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