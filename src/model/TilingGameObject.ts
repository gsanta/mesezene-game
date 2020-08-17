import { SpriteObject, GameObjectType } from "./SpriteObject";
import { TilingSprite, Point } from "pixi.js";


export class TilingGameObject extends SpriteObject {
    type = GameObjectType.TilingGameObject;
    container: TilingSprite;
    layer = 'background-layer';

    setViewportX(newViewportX: number) {
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.container.tilePosition.x -= (distanceTravelled * this.speed.x);
    }

    move(delta: Point) {
        this.container.tilePosition.x += delta.x;
        this.container.tilePosition.y += delta.y;
    }
}