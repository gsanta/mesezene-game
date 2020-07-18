import { AbstractScene } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { ScoreScene as ScoreScene, scoreSceneJson } from "../scenes/score_scene/ScoreScene";
import { GameScene } from "../scenes/game_scene/GameScene";
import { IService, ServiceCapability } from "./IService";
import { IListener } from "./EventService";
import { ScoreStoreEvents } from "../stores/ScoreStore";

export class SceneService implements IService, IListener {
    capabilities = [ServiceCapability.Listen];
    scenes: AbstractScene[] = [];
    runningScene: AbstractScene;

    sceneHtmlElement: HTMLDivElement;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.scenes.push(new GameScene(registry));
        this.scenes.push(new ScoreScene(registry));
        this.runningScene = this.scenes[0];

        this.registry.registerControlledObject(this);
    }

    listen(action: string): void {
        switch(action) {
            case ScoreStoreEvents.LIVES_CHANGED:
                if (this.registry.stores.scoreStore.getLives() <= 0) {
                    if (this.runningScene !== this.scenes[1]) {
                        this.runningScene.destroy();
                        this.runningScene = this.scenes[1];
                        this.runningScene.setup(this.sceneHtmlElement);
                    }
                }
            break;
        }
    }

    runScene(scene: AbstractScene) {
        this.runningScene = scene;
        this.runningScene.setup(this.sceneHtmlElement);
    }
}