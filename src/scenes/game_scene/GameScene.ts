import { Point } from "pixi.js";
import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole, GameObject } from "../../model/GameObject";
import { Registry } from "../../Registry";
import { GamepadKey } from "../../services/GamepadService";
import { IService, ServiceCapability } from "../../services/IService";
import { Layer } from "../../stores/LayerContainer";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { MenuSceneId } from "../menu_scene/MenuSceneState";
import { AppJson, SceneLoader } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSceneId } from "./GameSceneState";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObjectAutoRemover } from "./generators/ObjectAutoRemover";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { JumpMotionHandler } from "./motion/JumpMotionHandler";
import { LaneManager } from "./motion/LaneManager";

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

export class GameScene extends AbstractScene implements IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];


    objectAutoRemover: ObjectAutoRemover;
    obstacleGenerator: ObstacleGenerator;
    coinGenerator: CoinGenerator;
    obstacleCollider: ObstacleCollider;
    coinCollider: CoinCollider;
    laneManager: LaneManager;
    jumpMotion: JumpMotionHandler;

    gameSpeed: number = 2;
    gameLayerCount = 4;

    player: GameObject;

    constructor(registry: Registry) {
        super(registry, defaultAppJson);
        this.registry = registry;

        this.loader = new SceneLoader(this, this.registry);
        this.objectAutoRemover = new ObjectAutoRemover(this, registry, [GameObjectRole.Obstacle, GameObjectRole.Coin]);
        this.obstacleGenerator = new ObstacleGenerator(this, registry);
        this.coinGenerator = new CoinGenerator(this, registry);
        this.obstacleCollider = new ObstacleCollider(this, registry);
        this.coinCollider = new CoinCollider(this, registry);
        this.jumpMotion = new JumpMotionHandler();
        this.laneManager = new LaneManager(
            this,
            registry,
            [
                [500, 550],
                [550, 600],
                [600, 650],
                [650, 700],
            ]
        );

        this.spriteStore = new SpriteStore(this.registry);
    }

    tick() {}

    activate() {
        super.activate();
        this.registry.services.scene.menuScene.setMenu(this.registry.services.scene.menuScene.menus.game);
    }

    init() {
        this.reset();
        const application = this.registry.services.scene.application;
        
        const gameContainer = this.getLayerContainer();
        
        gameContainer.addLayer(new Layer('background-layer', application));
        gameContainer.addLayer(new Layer(`game-layer`, application))
        
        const appJson = defaultAppJson;
        this.laneManager.draw();
        this.gameSpeed = appJson.gameSpeed;
    
        const player = this.spriteStore.getByRole(GameObjectRole.Player)[0];
        player.moveTo(new Point(10, this.laneManager.min + 50));
        this.player = player;

        this.laneManager.addGameObject(player);
        this.getLayerContainer().getLayerById('game-layer').addChild(player);
        this.laneManager.player = player;
        this.jumpMotion.gameObject = player;

        const backgroundSprites = this.spriteStore.getByRole(GameObjectRole.Background);
        backgroundSprites.forEach(sprite => gameContainer.getLayerById('background-layer').addChild(sprite));
    }

    update() {
        const player = this.spriteStore.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = this.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-this.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.moveWith(deltaMove));

        this.laneManager.move();
        this.laneManager.updateGameObject(player);

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            this.jumpMotion.execute();
        }

        this.jumpMotion.update();
        this.objectAutoRemover.tick();
        this.obstacleGenerator.tick();
        this.coinGenerator.tick();

        if (this.obstacleCollider.checkCollisions()) {
            this.isPaused = true;
            this.gameOver();
        }

        this.coinCollider.checkCollisions();
    }

    private gameOver() {
        this.registry.services.scene.menuScene.setMenu(this.registry.services.scene.menuScene.menus.gameOver);
        this.registry.services.scene.getSceneById(MenuSceneId).show();
    }
}