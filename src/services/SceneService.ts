import { Application, Point } from "pixi.js";
import { SceneActions } from "../actions/SceneActions";
import { SpriteObject, GameObjectRole } from "../model/SpriteObject";
import { PlayerSprite } from "../scenes/game_scene/PlayerSprite";
import { Registry } from "../Registry";
import { Layer } from "../stores/LayerStore";
import { IListener } from "./EventService";
import { GamepadKey } from "./GamepadService";
import { IService, ServiceCapability } from "./IService";
import { AppJson, SceneLoader } from "../scenes/SceneLoader";
import { AbstractScene } from "../scenes/AbstractScene";
import { GameSpriteFactory } from "../scenes/game_scene/GameSpriteFactory";

export class SceneService extends AbstractScene implements IListener, IService {
    capabilities = [ServiceCapability.Listen];
    application: Application;
    sceneDimensions: Point;

    gameSpeed: number;
    gameLayerCount = 4;

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.application = new Application({width: 256, height: 256});
        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();
        

        this.application.stage.sortableChildren = true;

        this.registry.stores.layer.addLayer(new Layer('background-layer', [0, 0.73], this.application));
        this.registry.stores.layer.addLayer(new Layer(`game-layer-1`, [0.73, 0.78], this.application))
        this.registry.stores.layer.addLayer(new Layer(`game-layer-2`, [0.78, 0.83], this.application))
        this.registry.stores.layer.addLayer(new Layer(`game-layer-3`, [0.83, 0.88], this.application))
        this.registry.stores.layer.addLayer(new Layer(`game-layer-4`, [0.88, 0.93], this.application))
    }

    setup(appJson: AppJson) {
        this.registry.services.scene.sceneDimensions = new Point(appJson.width, appJson.height);
        this.registry.services.scene.gameSpeed = appJson.gameSpeed;
        this.registry.services.scene.application.renderer.resize(appJson.width, appJson.height);

        this.loader.load(appJson);
    }

    listen(action: string) {
        switch(action) {
            case SceneActions.SCENE_LOADED:
                this.start();
            break;
        }
    }

    private start() {
        this.registry.services.scene.application.ticker.add(delta => {
            this.update();
        });

        const player = this.registry.stores.game.getByRole(GameObjectRole.Player)[0];
        this.registry.stores.layer.getLayerById('game-layer-3').addChild(player);

        const backgroundSprites = this.registry.stores.game.getByRole(GameObjectRole.Background);
        backgroundSprites.forEach(sprite => this.registry.stores.layer.getLayerById('background-layer').addChild(sprite));

        this.vertialBorders = [405, 510];
        this.horizontalBorders = [0, this.registry.services.scene.sceneDimensions.x];

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {
        const player = <PlayerSprite> this.registry.stores.game.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = this.registry.stores.game.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-this.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));

        this.moveWithConstrains(player);

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            player.jump();
        }

        player.update();
        this.updateVerticalLayer(player);

        this.registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
    }

    private updateVerticalLayer(player: PlayerSprite) {
        const y = player.sprite.y + player.currentJumpY + player.sprite.height;
        const normalizedY = y / this.sceneDimensions.y;

        const newLayer = this.registry.stores.layer.layers.find(l => l.range[0] <= normalizedY && l.range[1] >= normalizedY);

        if (newLayer.id !== player.layer) {
            this.registry.stores.layer.getLayerById(player.layer).removeChild(player);
            this.registry.stores.layer.getLayerById(newLayer.id).addChild(player);
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