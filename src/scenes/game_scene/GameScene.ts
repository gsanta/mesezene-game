import { Application, Point } from "pixi.js";
import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole, SpriteObject } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { GamepadKey } from "../../services/GamepadService";
import { IService, ServiceCapability } from "../../services/IService";
import { GameObjectStore } from "../../stores/GameObjectStore";
import { Layer, LayerStore } from "../../stores/LayerStore";
import { AbstractScene } from "../AbstractScene";
import { defaultAppJson, SceneLoader } from "../SceneLoader";
import { CoinCollider } from "./colliders/CoinCollider";
import { ObstacleCollider } from "./colliders/ObstacleCollider";
import { GameSpriteFactory } from "./GameSpriteFactory";
import { CoinGenerator } from "./generators/CoinGenerator";
import { ObstacleGenerator } from "./generators/ObstacleGenerator";
import { PlayerSprite } from "./PlayerSprite";

export const GameSceneId = 'game-scene';
export class GameScene extends AbstractScene implements IListener, IService {
    id = GameSceneId;
    capabilities = [ServiceCapability.Listen];
    application: Application;
    sceneDimensions: Point;

    private obstacleGenerator: ObstacleGenerator;
    private coinGenerator: CoinGenerator;
    private obstacleCollider: ObstacleCollider;
    private coinCollider: CoinCollider;

    gameSpeed: number;
    gameLayerCount = 4;

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();
        this.obstacleGenerator = new ObstacleGenerator(this, registry);
        this.coinGenerator = new CoinGenerator(this, registry);
        this.obstacleCollider = new ObstacleCollider(this, registry);
        this.coinCollider = new CoinCollider(this, registry);

        this.layerStore = new LayerStore(this.registry);
        this.spriteStore = new GameObjectStore(this.registry);
    }

    setup(sceneHtmlElement: HTMLDivElement) {
        super.setup(sceneHtmlElement);

        this.application = new Application({width: 256, height: 256});
        this.application.stage.sortableChildren = true;


        this.layerStore.addLayer(new Layer('background-layer', [0, 0.73], this.application));
        this.layerStore.addLayer(new Layer(`game-layer-1`, [0.73, 0.78], this.application))
        this.layerStore.addLayer(new Layer(`game-layer-2`, [0.78, 0.83], this.application))
        this.layerStore.addLayer(new Layer(`game-layer-3`, [0.83, 0.88], this.application))
        this.layerStore.addLayer(new Layer(`game-layer-4`, [0.88, 0.93], this.application))

        const appJson = defaultAppJson;
        this.sceneDimensions = new Point(appJson.width, appJson.height);
        this.gameSpeed = appJson.gameSpeed;
        this.application.renderer.resize(appJson.width, appJson.height);

        this.registry.services.event.addListener(this);

        this.loader.load(appJson);
    }

    destroy() {
        this.registry.services.collision.stop();
    }

    listen(action: string) {
        switch(action) {
            case SceneActions.SCENE_LOADED:
                this.start();
            break;
        }
    }

    start() {
        this.application.ticker.add(delta => {
            this.update();
        });

        const player = this.spriteStore.getByRole(GameObjectRole.Player)[0];
        this.layerStore.getLayerById('game-layer-3').addChild(player);

        const backgroundSprites = this.spriteStore.getByRole(GameObjectRole.Background);
        backgroundSprites.forEach(sprite => this.layerStore.getLayerById('background-layer').addChild(sprite));

        this.vertialBorders = [405, 510];
        this.horizontalBorders = [0, this.sceneDimensions.x];

        this.obstacleGenerator.update();
        this.coinGenerator.update();

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {
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
        const y = player.sprite.y + player.currentJumpY + player.sprite.height;
        const normalizedY = y / this.sceneDimensions.y;

        const newLayer = this.layerStore.layers.find(l => l.range[0] <= normalizedY && l.range[1] >= normalizedY);

        if (newLayer.id !== player.layer) {
            this.layerStore.getLayerById(player.layer).removeChild(player);
            this.layerStore.getLayerById(newLayer.id).addChild(player);
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