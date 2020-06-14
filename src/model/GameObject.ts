import { Point, Sprite, TilingSprite } from "pixi.js";

export interface GameObjectJson {
    x: number;
    y: number;
    scale: number;
    path: string;
    name: string;
    isTiling: boolean;
    speedX: number;
    speedY: number;
    viewportX: number;
    viewportY: number;
}

export class GameObject {
    sprite: Sprite;
    protected viewportX: number;
    viewportY: number;
    speed: Point;
    name: string;

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

    // setVelocity(velocity: Point) {
    //     this.velocity = velocity;
    // }

    scale(point: Point) {
        this.sprite.scale = point;
    }

    // moveWithVelocity() {

    //     this.sprite.x += this.velocity.x;
    //     this.sprite.y += this.velocity.y;
    // }

    // move() {
    //     (this.sprite as TilingSprite).tilePosition.x += this.velocity.x;
    //     (this.sprite as TilingSprite).tilePosition.y += this.velocity.y;
    // }

    setViewportX(newViewportX: number) {
        this.viewportX = newViewportX;
        var distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        (this.sprite as TilingSprite).tilePosition.x -= (distanceTravelled * this.speed.x);
    }

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(speed: number) {
        this.viewportX += speed;
    }

    fromJson(json: GameObjectJson) {
        this.scale(new Point(json.scale, json.scale));
        this.name = json.name;
        this.speed = new Point(json.speedX, json.speedY);
        this.viewportX = json.viewportX;
        this.viewportY = json.viewportY;
    }
}