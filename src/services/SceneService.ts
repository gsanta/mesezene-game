import { Application, Point } from "pixi.js";
import { Registry } from "../Registry";
import { AbstractScene, SceneStateLegacy } from "../scenes/AbstractScene";
import { GameScene } from "../scenes/game_scene/GameScene";
import { AppJson, defaultAppJson } from "../scenes/SceneLoader";
import { ScoreScene as ScoreScene } from "../scenes/score_scene/ScoreScene";
import { ScoreStoreEvents } from "../stores/ScoreStore";
import { IListener } from "./EventService";
import { IService, ServiceCapability } from "./IService";
import { MenuScene } from "../scenes/menu_scene/MenuScene";
import { LayerContainer } from "../stores/LayerContainer";
import { MapSceneId, MapScene } from "../scenes/map_scene/MapScene";
import { GameSceneId } from "../scenes/game_scene/GameSceneState";

export class SceneService implements IService, IListener {
    capabilities = [ServiceCapability.Listen];
    scenes: AbstractScene[] = [];
    private overlayScenes: Set<AbstractScene> = new Set();

    sceneHtmlElement: HTMLDivElement;
    application: Application;
    sceneDimensions: Point;

    private registry: Registry;

    activeScene: AbstractScene;
    overlayScene: AbstractScene;

    gameScene: GameScene;
    scoreScene: ScoreScene;
    mapScene: MapScene;
    menuScene: MenuScene;

    constructor(registry: Registry) {        
        this.registry = registry;
        this.application = new Application({width: 256, height: 256});

        this.gameScene = new GameScene(registry);
        this.scoreScene = new ScoreScene(registry);
        this.mapScene = new MapScene(registry);
        this.menuScene = new MenuScene(registry);

        this.registerScene(this.gameScene, false);
        this.registerScene(this.scoreScene, false);
        this.registerScene(this.mapScene, false);
        this.registerScene(this.menuScene, true);

        this.registry.registerControlledObject(this);
    }

    registerScene(scene: AbstractScene, isOverlay: boolean) {
        this.scenes.indexOf(scene) === -1 && this.scenes.push(scene);
        isOverlay && this.overlayScenes.add(scene);
    }

    activateScene(sceneId: string) {
        const scene = this.scenes.find(scene => scene.id === sceneId);

        if (!scene) { throw new Error(`Scene '${sceneId}' not registered, so can not be activated.`);}

        if (this.overlayScenes.has(scene)) {
            this.overlayScene = scene;
        } else {
            if (this.activeScene !== scene) {
                this.activeScene && this.activeScene.destroy();
                this.activeScene = scene;
            }
        }
    }

    getActiveScene(isOverlay: boolean): AbstractScene {
        return isOverlay ? this.overlayScene : this.activeScene;
    }

    isActiveScene(sceneId: string): boolean {
        const scene = this.scenes.find(scene => scene.id === sceneId);
        if (!scene) { return false }

        return this.activeScene === scene || this.overlayScene === scene;
    }

    init(htmlElement: HTMLDivElement) {
        htmlElement.appendChild(this.application.view);
        this.sceneDimensions = new Point(defaultAppJson.width, defaultAppJson.height);
        
        this.scenes.forEach(scene => this.registry.stores.layer.addContainer(new LayerContainer(scene.id, this.registry)));
        this.application.renderer.resize(defaultAppJson.width, defaultAppJson.height);

        this.application.ticker.add(delta => {
            this.update();
        });
    }

    update() {
        // this.registry.services.stateTransition.update();

        this.activeScene.update();
    }

    listen(action: string): void {
        switch(action) {
            case ScoreStoreEvents.LIVES_CHANGED:
                if (this.registry.stores.scoreStore.getLives() <= 1) {
                    if (this.getActiveScene(false) && this.getActiveScene(false).id === GameSceneId) {
                        // this.getActiveScene(false).pause();
                        // this.getActiveScene(true).show();
                        // this.registry.services.renderService.reRender();
                    }
                }
            break;
        }
    }

    getSceneById(id: string) {
        return this.scenes.find(scene => scene.id === id);
    }
}