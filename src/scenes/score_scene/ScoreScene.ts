import { AbstractScene } from "../AbstractScene";
import { AppJson, SceneLoader } from "../SceneLoader";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Application, Point, Sprite, Texture } from "pixi.js";
import { Registry } from "../../Registry";
import { ServiceCapability, IService } from "../../services/IService";
import { SceneActions } from "../../actions/SceneActions";
import { IListener } from "../../services/EventService";
import { Layer, LayerContainer } from "../../stores/LayerContainer";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { GameObjectStore } from "../../stores/GameObjectStore";

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
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'lud',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 300,
            viewportY: 450,
            roles: [GameObjectRole.Character]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'eger',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 200,
            viewportY: 595,
            roles: [GameObjectRole.Character]
        },
    ]
}

export const ScoreSceneId = 'score-scene';
export class ScoreScene extends AbstractScene implements IListener, IService {
    id = ScoreSceneId;
    capabilities = [ServiceCapability.Listen];

    private containerId = 'score-container';
    
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();

        this.spriteStore = new GameObjectStore(this.registry);
    }

    listen(action: string) {
        switch(action) {
            case SceneActions.SCENE_LOADED:
                this.start();
            break;
        }
    }

    run() {
        const application = this.registry.services.scene.application;
        this.registry.stores.layer.addContainer(new LayerContainer(this.containerId));
    }

    setup(sceneHtmlElement: HTMLDivElement) {
        super.setup(sceneHtmlElement);

        const appJson = scoreSceneJson;

        this.registry.services.event.addListener(this);

        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.containerId).addLayer(new Layer('background-layer2', [0, 1], application));

        this.loader.load(appJson);
    }

    start() {

        // var bg = new Sprite(Texture.WHITE);
        // bg.width = this.sceneDimensions.x;
        // bg.height = this.sceneDimensions.y;
        // bg.tint = 0xffff00;
        // this.layerStore.getLayerById('background-layer2').addChild(new SpriteObject(bg));

        const background = this.spriteStore.getByRole(GameObjectRole.Background)[0];
        
        const backgroundLayer = this.registry.stores.layer.getContainer(this.containerId).getLayerById('background-layer2');
        
        backgroundLayer.addChild(background);

        const vonat = this.spriteStore.getByRole(GameObjectRole.Character)[0];
        backgroundLayer.addChild(vonat);

        const kigyo = this.spriteStore.getByRole(GameObjectRole.Character)[1];
        backgroundLayer.addChild(kigyo);

        const kutya = this.spriteStore.getByRole(GameObjectRole.Character)[2];
        backgroundLayer.addChild(kutya);

        const lud = this.spriteStore.getByRole(GameObjectRole.Character)[3];
        backgroundLayer.addChild(lud);

        const eger = this.spriteStore.getByRole(GameObjectRole.Character)[4];
        backgroundLayer.addChild(eger);

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {

    }
}