import { Application, Point } from "pixi.js";
import { Registry } from "../Registry";
import { AbstractScene } from "../scenes/AbstractScene";
import { GameScene } from "../scenes/game_scene/GameScene";
import { MapScene } from "../scenes/map_scene/MapScene";
import { MenuScene } from "../scenes/menu_scene/MenuScene";
import { ScoreScene as ScoreScene } from "../scenes/score_scene/ScoreScene";

export class SceneService{
    scenes: AbstractScene[] = [];
    private overlayScenes: Set<AbstractScene> = new Set();

    sceneHtmlElement: HTMLDivElement;
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
    }

    registerOverlay(scene: AbstractScene, isOverlay: boolean) {
        this.scenes.indexOf(scene) === -1 && this.scenes.push(scene);
        isOverlay && this.overlayScenes.add(scene);
    }

    activateOverlay(sceneId: string) {
        const scene = this.scenes.find(scene => scene.id === sceneId);

        if (!scene) { throw new Error(`Overlay '${sceneId}' not registered, so can not be activated.`);}

        if (this.overlayScenes.has(scene)) {
            this.overlayScene = scene;
        } else {
            if (this.activeScene !== scene) {
                this.activeScene && this.activeScene.destroy();
                this.activeScene = scene;
            }
        }
    }
}