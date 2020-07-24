import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { GameObjectStore } from "../../stores/GameObjectStore";
import { Layer } from "../../stores/LayerContainer";
import { AbstractScene } from "../AbstractScene";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { AppJson, SceneLoader } from "../SceneLoader";

export const mapSceneJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/sprite-sheet-characters.json',
    sprites: [
        {
            x: 0,
            y: 0,
            scale: 1,
            path: "assets/backgrounds/map.png",
            name: 'background-layer2',
            isBackgroundImage: true,
            speedX: 0,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        }
    ]
}

export const MapSceneId = 'map-scene';
export class MapScene extends AbstractScene implements IListener, IService {
    id = MapSceneId;
    capabilities = [ServiceCapability.Listen];

    constructor(registry: Registry) {
        super(registry);
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

    setup() {
        const appJson = mapSceneJson;

        this.registry.services.event.addListener(this);

        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('background-layer', [0, 1], application));

        this.loader.load(appJson);
    }

    start() {
        const background = this.spriteStore.getByRole(GameObjectRole.Background)[0];

        const backgroundLayer = this.registry.stores.layer.getContainer(this.id).getLayerById('background-layer');
        
        backgroundLayer.addChild(background);

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {

    }
}