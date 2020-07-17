import { AbstractScene } from "../AbstractScene";
import { AppJson, SceneLoader } from "../SceneLoader";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Application, Point, Sprite, Texture } from "pixi.js";
import { Registry } from "../../Registry";
import { ServiceCapability, IService } from "../../services/IService";
import { SceneActions } from "../../actions/SceneActions";
import { IListener } from "../../services/EventService";
import { Layer } from "../../stores/LayerStore";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";

export const scoreSceneJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/sprite-sheet-characters.json',
    sprites: [
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'vonat',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 440,
            viewportY: 430,
            roles: [GameObjectRole.Character]
        },
        {
            x: 0,
            y: 0,
            scale: 1,
            path: "assets/backgrounds/score-background.png",
            name: 'background-layer2',
            isBackgroundImage: true,
            speedX: 0,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'kigyo',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 50,
            viewportY: 500,
            roles: [GameObjectRole.Character]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'kutya',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 450,
            viewportY: 580,
            roles: [GameObjectRole.Character]
        },
    ]
}

export class ScoreScene extends AbstractScene implements IListener, IService {
    capabilities = [ServiceCapability.Listen];
    
    application: Application;
    sceneDimensions: Point;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.application = new Application({width: 256, height: 256});
        this.registry = registry;
        this.application = new Application({width: 256, height: 256});
        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();
    }

    listen(action: string) {
        switch(action) {
            case SceneActions.SCENE_LOADED:
                this.start();
            break;
        }
    }

    setup(appJson: AppJson) {
       
        this.sceneDimensions = new Point(appJson.width, appJson.height);
        this.application.renderer.resize(appJson.width, appJson.height);

        this.registry.services.event.addListener(this);

        this.registry.stores.layer.addLayer(new Layer('background-layer2', [0, 1], this.application));

        this.loader.load(appJson);
    }

    start() {
        this.application.ticker.add(delta => {
            this.update();
        });

        // var bg = new Sprite(Texture.WHITE);
        // bg.width = this.sceneDimensions.x;
        // bg.height = this.sceneDimensions.y;
        // bg.tint = 0xffff00;
        // this.registry.stores.layer.getLayerById('background-layer2').addChild(new SpriteObject(bg));

        const background = this.registry.stores.game.getByRole(GameObjectRole.Background)[0];
        this.registry.stores.layer.getLayerById('background-layer2').addChild(background);

        const vonat = this.registry.stores.game.getByRole(GameObjectRole.Character)[0];
        this.registry.stores.layer.getLayerById('background-layer2').addChild(vonat);

        const kigyo = this.registry.stores.game.getByRole(GameObjectRole.Character)[1];
        this.registry.stores.layer.getLayerById('background-layer2').addChild(kigyo);

        const kutya = this.registry.stores.game.getByRole(GameObjectRole.Character)[2];
        this.registry.stores.layer.getLayerById('background-layer2').addChild(kutya);

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {

    }
}