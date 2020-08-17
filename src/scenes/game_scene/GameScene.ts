import { Point, Container } from "pixi.js";
import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { GamepadKey } from "../../services/GamepadService";
import { IService, ServiceCapability } from "../../services/IService";
import { Layer } from "../../stores/LayerContainer";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { defaultAppJson, SceneLoader } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSceneId } from "./GameSceneState";
import { GameSpriteFactory } from "./GameSpriteFactory";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { LaneManager } from "./movement/LaneManager";
import { PlayerSprite } from "./PlayerSprite";
import { MenuSceneId } from "../menu_scene/MenuSceneState";
import { LaneGraphics } from "./LaneGraphics";
import { LaneObject } from "../../model/LaneObject";

export class GameScene extends AbstractScene implements IListener, IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];

    obstacleGenerator: ObstacleGenerator;
    coinGenerator: CoinGenerator;
    obstacleCollider: ObstacleCollider;
    coinCollider: CoinCollider;
    laneManager: LaneManager;

    gameSpeed: number = 2;
    gameLayerCount = 4;

    vertialBorders: [number, number];
    horizontalBorders: [number, number];

    constructor(registry: Registry) {
        super(registry, defaultAppJson);
        this.registry = registry;

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();
        this.obstacleGenerator = new ObstacleGenerator(this, registry);
        this.coinGenerator = new CoinGenerator(this, registry);
        this.obstacleCollider = new ObstacleCollider(this, registry);
        this.coinCollider = new CoinCollider(this, registry);
        this.laneManager = new LaneManager(
            [
                new LaneObject([400, 450]),
                new LaneObject([450, 510]),
                new LaneObject([510, 570])
            ],
            this,
            registry
        );

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen() {}

    doActivate() {
        this.registry.services.scene.menuScene.setMenu(this.registry.services.scene.menuScene.menus.game);
    }

    doDraw() {
        this.reset();
        const application = this.registry.services.scene.application;
    
        const gameContainer = this.getLayerContainer();
    
        gameContainer.addLayer(new Layer('background-layer', [0, 0.73], application));
        gameContainer.addLayer(new Layer(`game-layer-1`, [0.73, 0.78], application))
        gameContainer.addLayer(new Layer(`game-layer-2`, [0.78, 0.83], application))
        gameContainer.addLayer(new Layer(`game-layer-3`, [0.83, 0.88], application))
        gameContainer.addLayer(new Layer(`game-layer-4`, [0.88, 0.93], application))
        gameContainer.addLayer(new Layer('menu-layer', [0, 1], application));
    
        const appJson = defaultAppJson;
        this.gameSpeed = appJson.gameSpeed;
    
        const player = <PlayerSprite> this.spriteStore.getByRole(GameObjectRole.Player)[0];
        this.laneManager.setPlayer(player);

        gameContainer.getLayerById('game-layer-3').addChild(player);

        const backgroundSprites = this.spriteStore.getByRole(GameObjectRole.Background);
        backgroundSprites.forEach(sprite => gameContainer.getLayerById('background-layer').addChild(sprite));
        
        this.vertialBorders = [405, 510];
        this.horizontalBorders = [0, this.registry.services.scene.sceneDimensions.x];

        this.laneManager.draw();

        this.obstacleGenerator.update();
        this.coinGenerator.update();

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    doUpdate() {
        const player = <PlayerSprite> this.spriteStore.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = this.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-this.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));

        this.laneManager.move();

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            player.jump();
        }

        player.update();

        this.obstacleGenerator.update();
        this.coinGenerator.update();

        if (this.obstacleCollider.checkCollisions()) {
            this.pause();
            this.gameOver();
        }

        this.coinCollider.checkCollisions();
        this.registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
    }

    private gameOver() {
        this.registry.services.scene.menuScene.setMenu(this.registry.services.scene.menuScene.menus.gameOver);
        this.registry.services.scene.getSceneById(MenuSceneId).show();
    }
}