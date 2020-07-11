import { Application, Container, Point } from "pixi.js";
import { GameObject } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Player } from "../model/Player";
import { ScrollerObject } from "../model/ScrollerObject";
import { Registry } from "../Registry";
import { CollisionService } from "./CollisionService";
import { GamepadKey } from "./GamepadService";

export enum SceneActions {
    SCENE_UPDATE = 'SCENE_UPDATE',
    SCENE_START = 'SCENE_START'
}

export class SceneService extends GameScript {
    application: Application;
    sceneDimensions: Point;

    scroller: ScrollerObject;
    gameSpeed: number;
    
    backgroundContainer: Container;
    layerContainers: Container[];
    layers: {fromY: number, toY: number}[];

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];

    constructor(registry: Registry) {
        super(registry);

        this.application = new Application({width: 256, height: 256});
        this.application.stage.sortableChildren = true;

        this.layerContainers = [
            new Container(),
            new Container(),
            new Container(),
            new Container()
        ];
        this.backgroundContainer = new Container();
        this.application.stage.addChild(this.backgroundContainer);
        this.layerContainers.forEach(container => this.application.stage.addChild(container));
    }

    awake() {
        const scrollableSprites = this.registry.stores.game.gameObjects.filter(sprite => sprite !== this.registry.stores.game.player);
        this.scroller = new ScrollerObject(scrollableSprites);
        this.registry.services.scene.application.ticker.add(delta => {
            this.registry.gameScripts.forEach(script => script.update(delta));
        });

        this.vertialBorders = [405, 510];
        this.horizontalBorders = [0, this.registry.services.scene.sceneDimensions.x];
        this.layers = [
            {fromY: 510, toY: 545},
            {fromY: 545, toY: 580},
            {fromY: 580, toY: 615},
            {fromY: 615, toY: 650}
        ];

        this.registry.services.event.dispatch(SceneActions.SCENE_START);
    }

    update() {
        const player = this.registry.stores.game.player;
        const obstacles = this.registry.stores.game.obstacles;
        let balloons = this.registry.stores.game.balloons; 

        this.scroller.move(new Point(this.gameSpeed, 0));

        obstacles.forEach(platform => platform.move(platform.speed))
        balloons.forEach(platform => platform.move(platform.speed))
        this.moveWithConstrains(player);

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            player.jump();
        }

        player.update();
        this.updateVerticalLayer(player);

        this.registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
    }

    private updateVerticalLayer(player: Player) {
        const y = player.sprite.y + player.currentJumpY + player.sprite.height;

        const layerIndex = this.layers.findIndex(l => l.fromY <= y && l.toY >= y);

        if (layerIndex !== player.verticalLayer) {
            this.layerContainers[player.verticalLayer].removeChild(player.sprite);
            this.layerContainers[layerIndex].addChild(player.sprite);
            player.verticalLayer = layerIndex;
        }
    }


    private moveWithConstrains(player: GameObject) {
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