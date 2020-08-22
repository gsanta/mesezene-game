import { Application, Point } from "pixi.js";
import { Registry } from "../Registry";
import { AbstractScene } from "../scenes/AbstractScene";
import { GameScene, defaultAppJson } from "../scenes/game_scene/GameScene";
import { MapScene } from "../scenes/map_scene/MapScene";
import { MenuScene } from "../scenes/menu_scene/MenuScene";
import { ScoreScene as ScoreScene } from "../scenes/score_scene/ScoreScene";
import { LayerContainer } from "../stores/LayerContainer";

export class SceneService{
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
    }

    registerScene(scene: AbstractScene, isOverlay: boolean) {
        this.scenes.indexOf(scene) === -1 && this.scenes.push(scene);
        isOverlay && this.overlayScenes.add(scene);
    }

    activateScene(sceneId: string) {
        const scene = this.scenes.find(scene => scene.id === sceneId);

        if (!scene) { throw new Error(`Scene '${sceneId}' not registered, so can not be activated.`);}

        if (this.activeScene !== scene) {
            this.activeScene && this.activeScene.destroy();
        }

        this.activeScene = scene;
        this.activeScene.activate();
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
        
        this.application.renderer.resize(defaultAppJson.width, defaultAppJson.height);

        this.scenes.forEach(scene => {
            this.registry.stores.layer.addContainer(new LayerContainer(scene.id, this.registry));
        });

        this.application.ticker.add(delta => {
            this.update();
        });
    }

    update() {
        if (this.activeScene.isLoaded && !this.activeScene.isPaused) {
            this.activeScene.update();
        }
    }

    getSceneById(id: string) {
        return this.scenes.find(scene => scene.id === id);
    }
}