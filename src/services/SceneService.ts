import { GameObject, GameObjectType } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Point, Application } from "pixi.js";
import { ScrollerObject } from "../model/ScrollerObject";
import { Registry } from "../Registry";

export class SceneService extends GameScript {
    application: Application;
    sceneDimensions: Point;

    sprites: GameObject[] = [];
    scroller: ScrollerObject;
    player: GameObject;
    gameSpeed: number;

    platforms: GameObject[] = [];

    platformRegistry: GameObject[] = [];

    private vertialBorders: [number, number];
    private horizontalBorders: [number, number];

    constructor(registry: Registry) {
        super(registry);

        this.application = new Application({width: 256, height: 256});
    }

    awake() {
        this.scroller = new ScrollerObject(this.sprites);
        this.registry.services.scene.application.ticker.add(delta => {
            this.registry.gameScripts.forEach(script => script.update(delta));
        });

        this.vertialBorders = [400, 500];
        this.horizontalBorders = [0, this.registry.services.scene.sceneDimensions.x];
    }

    update() {
        // var newViewportX = this.scroller.getViewportX() + 5;
        // this.scroller.setViewportX(newViewportX);
        this.scroller.moveViewportXBy(this.gameSpeed);
        this.moveWithConstrains(this.player);
        // this.player.moveWithVelocity();

        // this.getSpriteByName('middle-layer').move();
        // this.getSpriteByName('background-layer').move();
    }

    private moveWithConstrains(player: GameObject) {
        let speed = new Point(player.speed.x, player.speed.y);
        if (player.sprite.x < this.horizontalBorders[0] && player.speed.x > 0) {
            speed.x = 0;
        } else if (player.sprite.x + player.sprite.width > this.horizontalBorders[1] && player.speed.x > 0) {
            speed.x = 0;
        }

        if (player.sprite.y < this.vertialBorders[0]) {
            speed.y = 0;
        } else if (player.sprite.y + player.sprite.height > this.vertialBorders[1]) {
            speed.y = 0;
        }

        player.move(speed);
    }

    private getSpriteByName(name: string) {
        return this.sprites.find(sprite => sprite.name === name);
    }

    private getTilingSprites(): GameObject[] {
        return this.sprites.filter(sprite => sprite.type === GameObjectType.TilingGameObject);
    }
}