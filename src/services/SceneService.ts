import { AbstractScene } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { GameScene } from "../scenes/game_scene/GameScene";
import { AbstractStore } from "../stores/AbstractStore";
import { appJson } from "../scenes/SceneLoader";

export class SceneService {
    scenes: AbstractScene[] = [];
    runningScene: AbstractScene;

    constructor(registry: Registry) {
        this.scenes.push(new GameScene(registry));
    }

    runScene(scene: AbstractScene) {
        this.runningScene = scene;
        this.runningScene.setup(appJson);
    }
}