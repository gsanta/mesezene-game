import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { defaultAppJson, SceneLoader } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSceneId, GameSceneState } from "./GameSceneState";
import { GameSpriteFactory } from "./GameSpriteFactory";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { PlayerMoveHandler } from "./movement/PlayerMoveHandler";
import { gameOverState } from "./scene_states/gameOverState";
import { gameRunningState } from "./scene_states/gameRunningState";

export class GameScene extends AbstractScene<GameSceneState> implements IListener, IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];

    obstacleGenerator: ObstacleGenerator;
    coinGenerator: CoinGenerator;
    obstacleCollider: ObstacleCollider;
    coinCollider: CoinCollider;
    playerMoveHandler: PlayerMoveHandler;

    gameSpeed: number = 2;
    gameLayerCount = 4;

    vertialBorders: [number, number];
    horizontalBorders: [number, number];

    constructor(registry: Registry) {
        super(registry, defaultAppJson);
        this.registry = registry;

        this.sceneStates.set(gameRunningState.stateId, gameRunningState);
        this.sceneStates.set(gameOverState.stateId, gameOverState);

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();
        this.obstacleGenerator = new ObstacleGenerator(this, registry);
        this.coinGenerator = new CoinGenerator(this, registry);
        this.obstacleCollider = new ObstacleCollider(this, registry);
        this.coinCollider = new CoinCollider(this, registry);
        this.playerMoveHandler = new PlayerMoveHandler(this, registry);

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen() {}
}