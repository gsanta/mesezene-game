import { Point } from "pixi.js";
import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { GamepadKey } from "../../services/GamepadService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { Layer } from "../../stores/LayerContainer";
import { AbstractScene, SceneStates, StateDescription } from "../AbstractScene";
import { defaultAppJson, SceneLoader } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSpriteFactory } from "./GameSpriteFactory";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { PlayerSprite } from "./PlayerSprite";
import { GameSceneId, GameSceneState } from "./GameSceneState";
import { PlayerMoveHandler } from "./movement/PlayerMoveHandler";
import { MenuSceneId, MenuSceneState } from "../menu_scene/MenuSceneState";


const gameStates: StateDescription<GameSceneState>[] = [
    new StateDescription<GameSceneState>(GameSceneId, GameSceneState.Running)
        .setOverlay(MenuSceneId, MenuSceneState.GameOverState, false)
        .onDraw((scene: GameScene, registry: Registry) => {
            scene.reset();
            const application = registry.services.scene.application;
        
            const gameContainer = registry.stores.layer.getContainer(scene.id);
        
            gameContainer.addLayer(new Layer('background-layer', [0, 0.73], application));
            gameContainer.addLayer(new Layer(`game-layer-1`, [0.73, 0.78], application))
            gameContainer.addLayer(new Layer(`game-layer-2`, [0.78, 0.83], application))
            gameContainer.addLayer(new Layer(`game-layer-3`, [0.83, 0.88], application))
            gameContainer.addLayer(new Layer(`game-layer-4`, [0.88, 0.93], application))
            gameContainer.addLayer(new Layer('menu-layer', [0, 1], application));
        
            const appJson = defaultAppJson;
            this.gameSpeed = appJson.gameSpeed;
        
            const player = <PlayerSprite> scene.spriteStore.getByRole(GameObjectRole.Player)[0];
            scene.playerMoveHandler.setPlayer(player);
    
            gameContainer.getLayerById('game-layer-3').addChild(player);
    
            const backgroundSprites = scene.spriteStore.getByRole(GameObjectRole.Background);
            backgroundSprites.forEach(sprite => gameContainer.getLayerById('background-layer').addChild(sprite));
    
            scene.vertialBorders = [405, 510];
            scene.horizontalBorders = [0, registry.services.scene.sceneDimensions.x];
    
            scene.obstacleGenerator.update();
            scene.coinGenerator.update();
    
            registry.services.event.dispatch(SceneActions.SCENE_START);
        })
        .onUpdate((scene: GameScene, registry: Registry) => {
            const player = <PlayerSprite> scene.spriteStore.getByRole(GameObjectRole.Player)[0];

            const scrollableSprites = scene.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
            const deltaMove = new Point(-scene.gameSpeed, 0);
            scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));
    
            scene.playerMoveHandler.move();

            if (registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
                player.jump();
            }

            player.update();
    
            scene.obstacleGenerator.update();
            scene.coinGenerator.update();
    
            if (scene.obstacleCollider.checkCollisions()) {
                // registry.services.scene.gameScene.activate(GameSceneState.GameOver);
            }
            scene.coinCollider.checkCollisions();

            registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
        }),

    new StateDescription<GameSceneState>(GameSceneId, GameSceneState.GameOver)
        .setOverlay(MenuSceneId, MenuSceneState.GameOverState)
        
    
]

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

        this.states.registerStates(gameStates);

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

    doDestroy() {
        this.registry.services.collision.stop();
    }

    protected doUpdate() {
        this.states.getSateById(this.activeStateId).update(this, this.registry);
    }
}