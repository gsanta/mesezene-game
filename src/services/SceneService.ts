import { AbstractScene } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { ScoreScene as ScoreScene, scoreSceneJson } from "../scenes/score_scene/ScoreScene";
import { GameScene } from "../scenes/game_scene/GameScene";
import { IService, ServiceCapability } from "./IService";
import { IListener } from "./EventService";
import { ScoreStoreEvents } from "../stores/ScoreStore";
import { Application, Point } from "pixi.js";
import { AppJson } from "../scenes/SceneLoader";

export class SceneService implements IService, IListener {
    capabilities = [ServiceCapability.Listen];
    scenes: AbstractScene[] = [];
    runningScene: AbstractScene;

    sceneHtmlElement: HTMLDivElement;

    application: Application;
    sceneDimensions: Point;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.scenes.push(new GameScene(registry));
        this.scenes.push(new ScoreScene(registry));
        this.runningScene = this.scenes[0];

        this.registry.registerControlledObject(this);
    }

    init(appJson: AppJson) {
        this.application = new Application({width: 256, height: 256});
        this.application.stage.sortableChildren = true;
        this.sceneDimensions = new Point(appJson.width, appJson.height);
        this.application.renderer.resize(appJson.width, appJson.height);

        this.application.ticker.add(delta => {
            this.update();
        });
    }

    update() {

    }

    listen(action: string): void {
        switch(action) {
            case ScoreStoreEvents.LIVES_CHANGED:
                if (this.registry.stores.scoreStore.getLives() <= 1) {
                    if (this.runningScene !== this.scenes[1]) {
                        this.runningScene.destroy();
                        this.runningScene = this.scenes[1];
                        this.runningScene.setup(this.sceneHtmlElement);
                        this.registry.services.renderService.reRender();
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