import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { SceneLoader } from "../SceneLoader";
import { mapSceneJson } from "./mapSceneJson";
import { worldmapDefaultState } from "./scene_states/worldmapDefaultState";
import { WorldMapState } from "./scene_states/WorldMapState";

export const MapSceneId = 'map_scene';
export class MapScene extends AbstractScene<WorldMapState> implements IListener, IService {
    id = MapSceneId;
    capabilities = [ServiceCapability.Listen];

    constructor(registry: Registry) {
        super(registry, mapSceneJson);
        this.registry = registry;
        this.activeStateId = WorldMapState.DefaultState;
        
        this.sceneStates.set(worldmapDefaultState.stateId, worldmapDefaultState);

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen(action: string) {}
}