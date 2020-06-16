import { GameObject, GameObjectType } from "./GameObject";
import { TilingSprite } from "pixi.js";


export class TilingGameObject extends GameObject {
    type = GameObjectType.TilingGameObject;
    sprite: TilingSprite;

    setViewportX(newViewportX: number) {
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.sprite.tilePosition.x -= (distanceTravelled * this.speed.x);
    }
}