import { GameObject, GameObjectType } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Point } from "pixi.js";
import { ScrollerObject } from "../model/ScrollerObject";

export class SceneService extends GameScript {
    sprites: GameObject[] = [];
    scroller: ScrollerObject;
    player: GameObject;
    gameSpeed: number;

    awake() {
        this.scroller = new ScrollerObject(this.getTilingSprites());
        this.registry.services.loader.application.ticker.add(delta => {
            this.registry.gameScripts.forEach(script => script.update(delta));
        });
    }

    update() {
        // var newViewportX = this.scroller.getViewportX() + 5;
        // this.scroller.setViewportX(newViewportX);
        this.scroller.moveViewportXBy(this.gameSpeed);
        // this.player.moveWithVelocity();

        // this.getSpriteByName('middle-layer').move();
        // this.getSpriteByName('background-layer').move();
    }

    private getSpriteByName(name: string) {
        return this.sprites.find(sprite => sprite.name === name);
    }

    private getTilingSprites(): GameObject[] {
        return this.sprites.filter(sprite => sprite.type === GameObjectType.TilingGameObject);
    }
}