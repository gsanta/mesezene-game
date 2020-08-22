import { Registry } from "../Registry";
import { SpriteStore } from "../stores/SpriteStore";
import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";
import { TextureStore } from "../stores/TextureStore";

export enum SceneStateLegacy {
    Loading = 'Loading',
    Ready = 'Ready',
    Running = 'Running',
    Stopped = 'Stopped',
    Destroyed = 'Destroyed'
}

export class SceneState<T extends string> {
    sceneId: string;
    stateId: T;

    constructor(sceneId: string, stateId: T) {
        this.sceneId = sceneId;
        this.stateId = stateId;
    }

    drawFunc: (scene: AbstractScene, registry: Registry) => void = () => {}
    updateFunc: (scene: AbstractScene, registry: Registry) => void = () => {};
    activateFunc: (scene: AbstractScene, registry: Registry) => void = () => {};
    destroyFunc: (scene: AbstractScene, registry: Registry) => void = () => {};

    overlay: {
        sceneId: string;
        stateId: string;
        displayOnLoad: boolean;
    }

    setOverlay(sceneId: string, stateId: string, displayOnLoad = true) {
        this.overlay = {
            sceneId,
            stateId,
            displayOnLoad
        }
        return this;
    }

    onActivate(activateFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.activateFunc = activateFunc;

        return this;
    }

    onDraw(drawFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.drawFunc = drawFunc;

        return this;
    }

    onUpdate(updateFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.updateFunc = updateFunc;

        return this;
    }

    onDestroy(destroyFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.destroyFunc = destroyFunc;

        return this;
    }
}

export abstract class AbstractScene {
    id: string;
    isOverlay = false;
    isLoaded = false;
    isPaused = false;
    isDestroyed = false;

    loader: SceneLoader;
    spriteStore: SpriteStore;
    textureStore: TextureStore;
    protected registry: Registry;
    protected sceneJson: AppJson;

    constructor(registry: Registry, sceneJson: AppJson) {
        this.registry = registry;
        this.sceneJson = sceneJson;

        this.textureStore = new TextureStore(this.registry);
    }

    getLayerContainer() {
        return this.registry.stores.layer.getContainer(this.id);
    }

    activate() {
        this.isPaused = false;
        this.isDestroyed = false;

        if (!this.isLoaded) {
            this.load()
                .then(() => {
                    this.init();
                });
        } else {
            this.init();
        }
    }

    reset() {
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        this.spriteStore.clear();
    }

    destroy() {
        this.isDestroyed = true;

        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
    }


    private load(): Promise<void> {
            return this.loader.load(this.sceneJson)
            .then(() => {
                this.isLoaded = true;
            })
            .catch((e) => {
                this.isLoaded = true;
                console.error(e);
            });
    }

    abstract init();
    abstract update();

    hide() {
        this.getLayerContainer().container.visible = false;
    }

    show() {
        this.getLayerContainer().container.visible = true;
        this.init();
    }
}