import { GameObject, GameObjectType } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Point, Application } from "pixi.js";
import { ScrollerObject } from "../model/ScrollerObject";
import { Registry } from "../Registry";
import { GamepadKey } from "./GamepadService";
import { Player } from "../model/Player";
import { CharacterCollider } from "./CharacterCollider";

export class SceneService extends GameScript {
    application: Application;
    sceneDimensions: Point;

    sprites: GameObject[] = [];
    scroller: ScrollerObject;
    player: Player;
    gameSpeed: number;

    platforms: GameObject[] = [];

    platformRegistry: GameObject[] = [];

    layers: {fromY: number, toY: number}[];

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];
    private collider: CharacterCollider;

    constructor(registry: Registry) {
        super(registry);

        this.application = new Application({width: 256, height: 256});
        this.collider = new CharacterCollider(registry);
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
            {fromY: 400, toY: 430},
            {fromY: 430, toY: 460},
            {fromY: 460, toY: 490},
            {fromY: 490, toY: 520}
        ];
    }

    update() {
        // var newViewportX = this.scroller.getViewportX() + 5;
        // this.scroller.setViewportX(newViewportX);
        this.scroller.move(new Point(this.gameSpeed, 0));

        this.platforms.forEach(platform => platform.move(platform.speed))
        this.moveWithConstrains(this.player);
        console.log(this.collider.calculateCollision());

        if (this.registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            this.player.jump();
        }

        this.player.update();
        this.updateVerticalLayer(this.player);
        console.log(this.player.verticalLayer);
        // this.player.moveWithVelocity();

        // this.getSpriteByName('middle-layer').move();
        // this.getSpriteByName('background-layer').move();
    }

    private updateVerticalLayer(player: Player) {
        const y = player.sprite.y - player.currentJumpY;

        const layerIndex = this.layers.findIndex(l => l.fromY <= y && l.toY >= y);
        player.verticalLayer = layerIndex;
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