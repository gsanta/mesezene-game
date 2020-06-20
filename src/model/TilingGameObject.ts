import { GameObject, GameObjectType } from "./GameObject";
import { TilingSprite, Point } from "pixi.js";


export class TilingGameObject extends GameObject {
    type = GameObjectType.TilingGameObject;
    sprite: TilingSprite;

    setViewportX(newViewportX: number) {
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.sprite.tilePosition.x -= (distanceTravelled * this.speed.x);
    }

    move(delta: Point) {
        this.sprite.tilePosition.x += delta.x;
        this.sprite.tilePosition.y += delta.y;
    }
}