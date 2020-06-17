import { Point, Sprite, TilingSprite } from "pixi.js";

export interface GameObjectJson {
    x: number;
    y: number;
    scale: number;
    path?: string;
    frameName?: string;
    name: string;
    isTiling: boolean;
    speedX: number;
    speedY: number;
    viewportX: number;
    viewportY: number;
}

export enum GameObjectType {
    GameObject = 'GameObject',
    TilingGameObject = 'TilingGameObject'
}

export class GameObject {
    type: GameObjectType = GameObjectType.GameObject;
    sprite: Sprite;
    protected viewportX: number = 0;
    viewportY: number = 0;
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

    getDimensions() {
        return new Point(this.sprite.width, this.sprite.height);
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
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.sprite.position.x -= (distanceTravelled * this.speed.x);
    }

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(speed: number) {
        this.viewportX += speed;
    }

    clone(): GameObject {
        const clone = new GameObject(new Sprite(this.sprite.texture));
        clone.speed = this.speed;

        clone.sprite.x = this.sprite.x;
        clone.sprite.y = this.sprite.y;
        clone.viewportX = this.viewportX;
        clone.viewportY = this.viewportY;

        return clone;
    }

    fromJson(json: GameObjectJson) {
        this.scale(new Point(json.scale, json.scale));
        this.name = json.name;
        this.speed = new Point(json.speedX, json.speedY);
        this.viewportX = json.viewportX;
        this.viewportY = json.viewportY;

        if (this.type === GameObjectType.GameObject) {
            this.sprite.position.x = json.viewportX;
            this.sprite.position.y = json.viewportY;
        }
    }
}