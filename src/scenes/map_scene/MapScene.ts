import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { Layer } from "../../stores/LayerContainer";
import { AbstractScene, StateDescription } from "../AbstractScene";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { AppJson, SceneLoader } from "../SceneLoader";
import { MenuSceneState, MenuSceneId } from "../menu_scene/MenuSceneState";

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

export enum WorldMapState {
    DefaultState = 'DefaultState',
}

export const MapSceneId = 'map_scene';


const worldMapStates: StateDescription<WorldMapState>[] = [
    new StateDescription<WorldMapState>(MapSceneId, WorldMapState.DefaultState)
        .setOverlay(MenuSceneId, MenuSceneState.WorldMapState)
        .onDraw((worldMapScene, registry) => {
            const background = worldMapScene.spriteStore.getByRole(GameObjectRole.Background)[0];

            const backgroundLayer = registry.stores.layer.getContainer(worldMapScene.id).getLayerById('background-layer');
            
            backgroundLayer.addChild(background);
        
            registry.services.event.dispatch(SceneActions.SCENE_START);
        })
]

export class MapScene extends AbstractScene<WorldMapState> implements IListener, IService {
    id = MapSceneId;
    capabilities = [ServiceCapability.Listen];

    constructor(registry: Registry) {
        super(registry, mapSceneJson);
        this.registry = registry;
        this.activeStateId = WorldMapState.DefaultState;
        
        this.states.registerStates(worldMapStates);

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen(action: string) {}

    doDraw() {
        this.registry.services.event.addListener(this);

        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('background-layer', [0, 1], application));

        this.states.getSateById(this.activeStateId).draw(this, this.registry);
    }

    doDestroy() {

    }

    doUpdate() {

    }
}