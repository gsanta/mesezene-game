import { AbstractScene } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { GameScene } from "../scenes/game_scene/GameScene";
import { ScoreScene as ScoreScene, scoreSceneJson } from "../scenes/score_scene/ScoreScene";

export class SceneService {
    scenes: AbstractScene[] = [];
    runningScene: AbstractScene;

    constructor(registry: Registry) {
        // this.scenes.push(new GameScene(registry));
        this.scenes.push(null)
        this.scenes.push(new ScoreScene(registry))
    }

    runScene(scene: AbstractScene) {
        this.runningScene = scene;
        this.runningScene.setup(scoreSceneJson);
    }
}