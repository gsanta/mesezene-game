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

export class StateDescription<T extends string> {
    sceneId: string;
    stateId: T;

    constructor(sceneId: string, stateId: T) {
        this.sceneId = sceneId;
        this.stateId = stateId;
    }

    private drawFunc: (scene: AbstractScene, registry: Registry) => void;
    private updateFunc: (scene: AbstractScene, registry: Registry) => void;
    private activateFunc: (scene: AbstractScene, registry: Registry) => void;

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

    activate(scene: AbstractScene, registry: Registry) {
        this.activateFunc && this.activateFunc(scene, registry);
    }

    onDraw(drawFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.drawFunc = drawFunc;

        return this;
    }

    draw(scene: AbstractScene, registry: Registry) {

        if (this.overlay) {
            const overlayScene = registry.services.scene.getSceneById(this.overlay.sceneId);
            overlayScene.activate(this.overlay.stateId);
            registry.services.scene.overlayScene = overlayScene;
            // registry.services.scene.getActiveScene(true).activeStateId = this.overlay.stateId;
        } else if (!scene.isOverlay && registry.services.scene.overlayScene) {
            registry.services.scene.overlayScene.destroy();
            registry.services.scene.overlayScene = undefined;
        }

        this.drawFunc && this.drawFunc(scene, registry);
    }

    onUpdate(updateFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.updateFunc = updateFunc;

        return this;
    }

    update(scene: AbstractScene, registry: Registry) {
        this.updateFunc && this.updateFunc(scene, registry);
    }
}

export class SceneStates {
    private sceneStatesMap: Map<string, StateDescription<string>> = new Map();

    registerStates<T extends string>(states: StateDescription<T>[]) {
        states.forEach(state => this.sceneStatesMap.set(state.stateId, state));
    }

    getSateById<T extends string, U extends AbstractScene>(sceneState: T): StateDescription<T> {
        return <StateDescription<T>> this.sceneStatesMap.get(sceneState);
    }
}


export abstract class AbstractScene<T extends string = string> {
    id: string;
    isOverlay = false;
    isLoaded = false;
    isPaused = false;
    isDestroyed = false;
    // application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;
    states: SceneStates = new SceneStates();
    activeStateId: string;

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

    activate(stateId: T) {
        this.activeStateId = stateId;
        this.registry.services.scene.activateScene(this.id);

        const state = this.states.getSateById(this.activeStateId);
        
        if (state.overlay) {
            const overlayScene = this.registry.services.scene.getSceneById(state.overlay.sceneId);
            state.overlay.displayOnLoad === false && overlayScene.hide();
            overlayScene.activate(state.overlay.stateId);
        }

        if (!this.isLoaded) {
            this.load()
                .then(() => {
                    this.hidden === false && this.draw();
                    // this.states.getSateById(this.activeStateId).activate(this, this.registry);
                });
        } else {
            this.hidden === false && this.draw();

            // this.states.getSateById(this.activeStateId).activate(this, this.registry);
        }
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

        this.doDestroy();
        this.state = SceneStateLegacy.Destroyed;
        // this.spriteStore.getAll().forEach(spriteObject => spriteObject.destroy());
        this.registry.stores.layer.getContainer(this.id).container.removeChildren();
        this.getLayerContainer().removeAllLayers();
        // this.application.destroy(true);
    }

    draw() {
        const state = this.states.getSateById(this.activeStateId);
        state.draw(this, this.registry);
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
        // if (this.state !== SceneState.Hidden) { throw new Error(`'show()' can only be applied to a hidden scene, current state is: ${this.state}`); }
        console.log('now it is visible')
        this.getLayerContainer().container.visible = true;
        this.hidden = false;
        this.draw();
    }

    isHidden() {
        return this.hidden;
    }

    protected abstract doUpdate();
    protected abstract doDestroy();
}