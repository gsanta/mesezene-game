import { Point } from "pixi.js";
import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { GamepadKey } from "../../services/GamepadService";
import { IService, ServiceCapability } from "../../services/IService";
import { GameObjectStore } from "../../stores/GameObjectStore";
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
import { MenuSceneId, MenuSceneState } from "../menu_scene/MenuSceneState";


const gameStates: StateDescription<GameSceneState>[] = [
    new StateDescription<GameSceneState>(GameSceneId, GameSceneState.Running)
        // .overlay(MenuSceneId, MenuSceneState.GameOverState)
        .onDraw((scene: GameScene, registry: Registry) => {
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
        
            const player = scene.spriteStore.getByRole(GameObjectRole.Player)[0];
    
            gameContainer.getLayerById('game-layer-3').addChild(player);
    
            const backgroundSprites = scene.spriteStore.getByRole(GameObjectRole.Background);
            backgroundSprites.forEach(sprite => gameContainer.getLayerById('background-layer').addChild(sprite));
    
            scene.vertialBorders = [405, 510];
            scene.horizontalBorders = [0, registry.services.scene.sceneDimensions.x];
    
            scene.obstacleGenerator.update();
            scene.coinGenerator.update();
    
            registry.services.event.dispatch(SceneActions.SCENE_START);
        })
]

export class GameScene extends AbstractScene implements IListener, IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];

    obstacleGenerator: ObstacleGenerator;
    coinGenerator: CoinGenerator;
    private obstacleCollider: ObstacleCollider;
    private coinCollider: CoinCollider;

    gameSpeed: number;
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

        this.spriteStore = new GameObjectStore(this.registry);
    }

    protected doDraw() {
        this.states.getSateById(this.activeStateId).draw(this, this.registry);
    }

    listen() {}

    doDestroy() {
        this.registry.services.collision.stop();
    }

    protected doUpdate() {
        const player = <PlayerSprite> this.spriteStore.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = this.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-this.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));

        this.moveWithConstrains(player);

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            player.jump();
        }

        player.update();
        this.updateVerticalLayer(player);

        this.obstacleGenerator.update();
        this.coinGenerator.update();
        this.obstacleCollider.checkCollisions();
        this.coinCollider.checkCollisions();

        this.registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
    }

    private updateVerticalLayer(player: PlayerSprite) {
        const gameContainer = this.registry.stores.layer.getContainer(this.id);

        const y = player.sprite.y + player.currentJumpY + player.sprite.height;
        const normalizedY = y / this.registry.services.scene.sceneDimensions.y;

        const newLayer = gameContainer.layers.find(l => l.range[0] <= normalizedY && l.range[1] >= normalizedY);

        if (newLayer.id !== player.layer) {
            gameContainer.getLayerById(player.layer).removeChild(player);
            gameContainer.getLayerById(newLayer.id).addChild(player);
            player.layer = newLayer.id;
        }
    }


    private moveWithConstrains(player: SpriteObject) {
        let speed = new Point(player.speed.x, player.speed.y);

        if (player.sprite.x < this.horizontalBorders[0] && player.speed.x < 0) {
            speed.x = 0;
        } else if (player.sprite.x + player.sprite.width > this.horizontalBorders[1] && player.speed.x > 0) {
            speed.x = 0;
        }
        
        if (player.sprite.y < this.vertialBorders[0] && speed.y < 0) {
            speed.y = 0;
        } else if (player.sprite.y > this.vertialBorders[1] && player.speed.y > 0) {
            speed.y = 0;
        }
        
        player.move(speed);
    }
}