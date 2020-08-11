import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { Layer } from "../../stores/LayerContainer";
import { AbstractScene } from "../AbstractScene";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { AppJson, SceneLoader } from "../SceneLoader";

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

    constructor(registry: Registry) {
        super(registry, scoreSceneJson);
        this.registry = registry;
        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen(action: string) {}

    doDraw() {
        const appJson = scoreSceneJson;

        this.registry.services.event.addListener(this);

        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('background-layer2', [0, 1], application));

        const background = this.spriteStore.getByRole(GameObjectRole.Background)[0];
        
        const backgroundLayer = this.registry.stores.layer.getContainer(this.id).getLayerById('background-layer2');
        
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
}