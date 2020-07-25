import { Point, Sprite, TilingSprite } from "pixi.js";
import { Rectangle } from "./primitives/Rectangle";

export interface SpriteObjectJson {
    x: number;
    y: number;
    scale: number;
    path?: string;
    frameName?: string;
    name: string;
    isBackgroundImage: boolean;
    speedX: number;
    speedY: number;
    viewportX: number;
    viewportY: number;
    collisionBox?: string;
    roles: string[];
}

export enum GameObjectType {
    GameObject = 'GameObject',
    TilingGameObject = 'TilingGameObject'
}

export enum GameObjectTag {
    Collided = 'Collided',
    CollisionSuspended = 'CollisionSuspended'
}

export enum GameObjectRole {
    Obstacle = 'Obstacle',
    Coin = 'Coin',
    Player = 'Player',
    Template = 'Template',
    Background = 'Background',
    Character = 'Character'
}

export class SpriteObject {
    type: GameObjectType = GameObjectType.GameObject;
    sprite: Sprite;
    protected viewportX: number = 0;
    viewportY: number = 0;
    speed: Point;
    id: string;
    scale: Point = new Point(0, 0);
    tags: Set<GameObjectTag> = new Set();
    roles: Set<GameObjectRole> = new Set();

    layer: string;
    collisionBox: Rectangle;

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

    getDimensions(): Rectangle {
        return new Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
    }

    getCollisionBox(): Rectangle {
        if (this.collisionBox) {
            const [x, y, width, height] = [this.sprite.x + this.collisionBox.x, this.sprite.y + this.collisionBox.y, this.collisionBox.width, this.collisionBox.height];
            return new Rectangle(x, y, width, height);
        }

        if (this.id.indexOf('balloon') !== -1) {
            return new Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height / 4);
        }

        return this.getDimensions();
    }

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(speed: number) {
        this.viewportX += speed;
    }

    move(delta: Point) {
        if (delta.y) {
            this.sprite.position.y += delta.y;
        }

        if (delta.x) {
            this.sprite.position.x += delta.x;
        }
    }

    destroy() {
        this.sprite.destroy({children: true, texture: true});
    }

    clone(): SpriteObject {
        const clone = new SpriteObject(new Sprite(this.sprite.texture));
        clone.speed = this.speed;

        clone.sprite.x = this.sprite.x;
        clone.sprite.y = this.sprite.y;
        clone.viewportX = this.viewportX;
        clone.viewportY = this.viewportY;
        clone.scale = this.scale ? new Point(this.scale.x, this.scale.y) : new Point(1, 1);
        clone.sprite.scale = this.scale;
        clone.id = this.id;
        
        Array.from(this.roles).forEach(role => clone.roles.add(role));

        if (this.collisionBox) {
            clone.collisionBox =  this.collisionBox;
        }

        return clone;
    }

    fromJson(json: SpriteObjectJson) {
        this.scale = json.scale ? new Point(json.scale, json.scale) : new Point(1, 1);
        this.sprite.scale = this.scale;
        this.id = json.frameName || json.name;
        this.speed = new Point(json.speedX, json.speedY);
        this.viewportX = json.viewportX;
        this.viewportY = json.viewportY;
        json.roles.forEach(role => this.roles.add(<GameObjectRole> role));

        if (this.type === GameObjectType.GameObject) {
            this.sprite.position.x = json.viewportX;
            this.sprite.position.y = json.viewportY;
        }

        if (json.collisionBox) {
            const [x, y, width, height] = json.collisionBox.split(' ').map(val => parseInt(val, 10));
            this.collisionBox = new Rectangle(x, y, width * this.scale.x, height * this.scale.y);
        }
    }
}