import { Application, Container, Point } from "pixi.js";
import { GameObject } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Player } from "../model/Player";
import { ScrollerObject } from "../model/ScrollerObject";
import { Registry } from "../Registry";
import { CharacterCollider } from "./CharacterCollider";
import { GamepadKey } from "./GamepadService";

export class SceneService extends GameScript {
    application: Application;
    sceneDimensions: Point;

    sprites: GameObject[] = [];
    scroller: ScrollerObject;
    player: Player;
    gameSpeed: number;

    platforms: GameObject[] = [];

    platformRegistry: GameObject[] = [];

    backgroundContainer: Container;
    layerContainers: Container[];
    layers: {fromY: number, toY: number}[];

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];
    private collider: CharacterCollider;

    constructor(registry: Registry) {
        super(registry);

        this.application = new Application({width: 256, height: 256});
        this.application.stage.sortableChildren = true;
        this.collider = new CharacterCollider(registry);

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
        const scrollableSprites = this.sprites.filter(sprite => sprite !== this.player);
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
    }

    update() {
        this.scroller.move(new Point(this.gameSpeed, 0));

        this.platforms.forEach(platform => platform.move(platform.speed))
        this.moveWithConstrains(this.player);

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            this.player.jump();
        }

        this.player.update();
        this.updateVerticalLayer(this.player);
        console.log(this.collider.calculateCollision())
    }

    private updateVerticalLayer(player: Player) {
        const y = player.sprite.y + player.currentJumpY + player.sprite.height;
        console.log(player.sprite.y + player.sprite.height);

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