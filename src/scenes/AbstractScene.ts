import { Registry } from "../Registry";
import { SpriteStore } from "../stores/SpriteStore";
import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";
import { TextureStore } from "../stores/TextureStore";
import { LayerContainer } from "../stores/LayerContainer";

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
    factory: ISpriteFactory;
    loader: SceneLoader;

    private hidden = false;
    
    spriteStore: SpriteStore;
    textureStore: TextureStore;
    private sceneHtmlElement: HTMLDivElement;
    protected registry: Registry;
    protected sceneJson: AppJson;

    constructor(registry: Registry, sceneJson: AppJson) {
        this.registry = registry;
        this.sceneJson = sceneJson;

        this.textureStore = new TextureStore(this.registry);
    }

    state: SceneStateLegacy = SceneStateLegacy.Destroyed;

    getLayerContainer() {
        return this.registry.stores.layer.getContainer(this.id);
    }

    getState() {
        return this.state;
    }

    activate() {
        this.isPaused = false;
        this.isDestroyed = false;
        
        // if (state.overlay) {
        //     const overlayScene = this.registry.services.scene.getSceneById(state.overlay.sceneId);
        //     overlayScene.hidden = !state.overlay.displayOnLoad;
        //     overlayScene.activate(state.overlay.stateId, state.overlay.displayOnLoad);
        // }

        if (!this.isLoaded) {
            this.load()
                .then(() => {
                    this.draw();
                });
        } else {
            this.draw();
        }

        this.doActivate();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    reset() {
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        this.spriteStore.clear();
    }

    destroy() {
        this.isDestroyed = true;

        this.state = SceneStateLegacy.Destroyed;
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        // this.registry.stores.layer.removeContainer(this.id);
    }

    draw() {
        this.doDraw();
    }

    private load(): Promise<void> {
        this.state = SceneStateLegacy.Loading;
        return this.loader.load(this.sceneJson)
            .then(() => {
                this.isLoaded = true;
            })
            .catch((e) => {
                this.isLoaded = true;
                console.error(e);
            });
    }

    update() {
        if (this.isLoaded && !this.isPaused) {
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
        this.getLayerContainer().container.visible = true;
        this.hidden = false;
        this.draw();
    }

    isHidden() {
        return this.hidden;
    }

    abstract doDraw();
    abstract doUpdate();
    abstract doActivate();
}