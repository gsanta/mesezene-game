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

export class StateDescription<T extends string> {
    sceneId: string;
    stateId: T;

    constructor(sceneId: string, stateId: T) {
        this.sceneId = sceneId;
        this.stateId = stateId;
    }

    private drawFunc: (scene: AbstractScene, registry: Registry) => void;
    private updateFunc: (scene: AbstractScene, registry: Registry) => void;

    overlay: {
        sceneId: string;
        stateId: string;
    }

    setOverlay(sceneId: string, stateId: string) {
        this.overlay = {
            sceneId,
            stateId
        }
        return this;
    }

    onDraw(drawFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.drawFunc = drawFunc;

        return this;
    }

    draw(scene: AbstractScene, registry: Registry) {
        if (this.overlay) {
            const overlayScene = registry.services.scene.getSceneById(this.overlay.sceneId);
            overlayScene.activeStateId = this.overlay.stateId;
            overlayScene.load();
            registry.services.scene.overlayScene = overlayScene;
            // registry.services.scene.getActiveScene(true).activeStateId = this.overlay.stateId;
        } else if (!scene.isOverlay && registry.services.scene.overlayScene) {
            registry.services.scene.overlayScene.destroy();
            registry.services.scene.overlayScene = undefined;
        }

        this.drawFunc(scene, registry);
    }

    onUpdate(updateFunc: (scene: AbstractScene, registry: Registry) => void) {
        this.updateFunc = updateFunc;

        return this;
    }

    update(scene: AbstractScene, registry: Registry) {
        this.updateFunc(scene, registry);
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


export abstract class AbstractScene<T extends string = null> {
    id: string;
    isOverlay = false;
    isLoading = false;
    // application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;
    states: SceneStates = new SceneStates();
    activeStateId: string;

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
        this.isLoading = true;
        this.state = SceneStateLegacy.Loading;
        this.loader.load(this.sceneJson)
            .then(() => {
                this.isLoading = false;
                this.doDraw();
            })
            .catch((e) => {
                this.isLoading = false;
                console.error(e);
            });
    }

    update() {
        if (!this.isLoading) {
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

    protected abstract doDraw();
    protected abstract doUpdate();
    protected abstract doDestroy();
}