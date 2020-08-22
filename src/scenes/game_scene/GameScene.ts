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
import { SceneLoader, AppJson } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSceneId } from "./GameSceneState";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { LaneManager } from "./motion/LaneManager";
import { MenuSceneId } from "../menu_scene/MenuSceneState";
import { LaneObject } from "../../model/LaneObject";
import { JumpMotionHandler } from "./motion/JumpMotionHandler";

export const defaultAppJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/sprite-sheet.json',
    sprites: [
        // {
        //     x: 0,
        //     y: 96,
        //     scale: 0.4,
        //     path: "assets/sprites/balloon2.png",
        //     name: 'player',
        //     isTiling: false,
        //     speedX: 1,
        //     speedY: 1,
        //     viewportX: 0,
        //     viewportY: 0
        // },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/background.png",
            name: 'background-layer',
            isBackgroundImage: true,
            speedX: -0.64,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/middle.png",
            name: 'middle-layer',
            isBackgroundImage: true,
            speedX: -1.28,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_01',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_02',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_03',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'balloon_01',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Coin, GameObjectRole.Template]
            // collisionBox: "0 0 67 80"
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'player',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Player]
        },
        // {
        //     x: 0,
        //     y: 0,
        //     scale: 0.5,
        //     path: "assets/sprites/kutya.png",
        //     name: 'front-layer',
        //     isBackgroundImage: false,
        //     speedX: 0,
        //     speedY: 0,
        //     viewportX: 32,
        //     viewportY: 470,
        //     roles: []
        // }
    ]
}

export class GameScene extends AbstractScene implements IListener, IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];

    obstacleGenerator: ObstacleGenerator;
    coinGenerator: CoinGenerator;
    obstacleCollider: ObstacleCollider;
    coinCollider: CoinCollider;
    laneManager: LaneManager;
    jumpMotion: JumpMotionHandler;

    gameSpeed: number = 2;
    gameLayerCount = 4;

    vertialBorders: [number, number];
    horizontalBorders: [number, number];

    constructor(registry: Registry) {
        super(registry, defaultAppJson);
        this.registry = registry;

        this.loader = new SceneLoader(this, this.registry);
        this.obstacleGenerator = new ObstacleGenerator(this, registry);
        this.coinGenerator = new CoinGenerator(this, registry);
        this.obstacleCollider = new ObstacleCollider(this, registry);
        this.coinCollider = new CoinCollider(this, registry);
        this.jumpMotion = new JumpMotionHandler();
        this.laneManager = new LaneManager(
            [
                new LaneObject([400, 450]),
                new LaneObject([450, 510]),
                new LaneObject([510, 570]),
                new LaneObject([510, 610])
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
    
        gameContainer.addLayer(new Layer('background-layer', application));
        gameContainer.addLayer(new Layer(`game-layer`, application))
    
        const appJson = defaultAppJson;
        this.gameSpeed = appJson.gameSpeed;
    
        const player = this.spriteStore.getByRole(GameObjectRole.Player)[0];
        this.laneManager.setPlayer(player);
        this.jumpMotion.gameObject = player;

        gameContainer.getLayerById('game-layer').addChild(player);

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
        const player = this.spriteStore.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = this.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-this.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));

        this.laneManager.move();

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            this.jumpMotion.execute();
        }

        this.jumpMotion.update();

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