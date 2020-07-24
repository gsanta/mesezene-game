import { Application, Point } from "pixi.js";
import { Registry } from "../Registry";
import { AbstractScene } from "../scenes/AbstractScene";
import { GameScene } from "../scenes/game_scene/GameScene";
import { AppJson, defaultAppJson } from "../scenes/SceneLoader";
import { ScoreScene as ScoreScene } from "../scenes/score_scene/ScoreScene";
import { ScoreStoreEvents } from "../stores/ScoreStore";
import { IListener } from "./EventService";
import { IService, ServiceCapability } from "./IService";
import { MenuScene } from "../scenes/menu_scene/MenuScene";
import { LayerContainer } from "../stores/LayerContainer";
import { MapSceneId, MapScene } from "../scenes/map_scene/MapScene";

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
        this.application = new Application({width: 256, height: 256});

        this.scenes.push(new GameScene(registry));
        this.scenes.push(new ScoreScene(registry));
        this.scenes.push(new MenuScene(registry));
        this.scenes.push(new MapScene(registry));
        this.runningScene = this.scenes[0];

        this.registry.registerControlledObject(this);
    }

    init(htmlElement: HTMLDivElement) {
        htmlElement.appendChild(this.application.view);
        this.sceneDimensions = new Point(defaultAppJson.width, defaultAppJson.height);
        
        this.scenes.forEach(scene => this.registry.stores.layer.addContainer(new LayerContainer(scene.id, this.registry)));
        this.scenes[2].setup();

        this.application.renderer.resize(defaultAppJson.width, defaultAppJson.height);

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
                        this.runningScene.setup();
                        this.registry.services.renderService.reRender();
                    }
                }
            break;
        }
    }

    runScene(scene: AbstractScene) {
        this.runningScene = scene;
        this.runningScene.setup();
    }
}