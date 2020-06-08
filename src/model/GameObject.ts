import { Point, Sprite } from "pixi.js";

export interface GameObjectJson {
    x: number;
    y: number;
    scale: number;
    path: string;
}

export class GameObject {
    sprite: Sprite;
    velocity: Point = new Point(0, 0);

    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }

    setPosition(point: Point) {
        this.sprite.x = point.x;
        this.sprite.y = point.y;
    }

    getPosition(): Point {
        return new Point(this.sprite.x, this.sprite.y);
    }

    setVelocity(velocity: Point) {
        this.velocity = velocity;
    }

    scale(point: Point) {
        this.sprite.scale = point;
    }

    moveWithVelocity() {
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

    }

    fromJson(json: GameObjectJson) {
        this.setPosition(new Point(json.x, json.y));
        this.scale(new Point(json.scale, json.scale));
    }
}