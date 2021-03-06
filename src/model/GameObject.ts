import { Point, Sprite, TilingSprite, Container, Texture, Graphics, Loader } from "pixi.js";
import { Rectangle } from "./primitives/Rectangle";
import { GraphicsObject } from "./GraphicsObject";
import { appJson } from "../scenes/menu_scene/MenuScene";
import { MesezeneGlobals } from "./MesezeneGlobals";

declare const mesezeneGlobals: MesezeneGlobals;

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

export class GameObject {
    type: GameObjectType = GameObjectType.GameObject;

    isTiling = false;
    container: Container;
    speed: Point;
    id: string;
    scale: Point = new Point(0, 0);
    tags: Set<GameObjectTag> = new Set();
    roles: Set<GameObjectRole> = new Set();

    layer: number;
    collisionBox: Rectangle;

    children: (GraphicsObject | GameObject)[] = [];

    constructor(sprite: Container) {
        this.container = sprite;
    }

    getDimensions(): Rectangle {
        return new Rectangle(this.container.x, this.container.y, this.container.width, this.container.height);
    }

    getCollisionBox(): Rectangle {
        if (this.collisionBox) {
            const [x, y, width, height] = [this.container.x + this.collisionBox.x, this.container.y + this.collisionBox.y, this.collisionBox.width, this.collisionBox.height];
            return new Rectangle(x, y, width, height);
        }

        if (this.id.indexOf('balloon') !== -1) {
            return new Rectangle(this.container.x, this.container.y, this.container.width, this.container.height / 4);
        }

        return this.getDimensions();
    }

    moveWith(delta: Point) {
        if (delta.y) {
            if (this.isTiling) {
                (this.container as TilingSprite).tilePosition.y += delta.y;
            } else {
                this.container.position.y += delta.y;
            }
        }

        if (delta.x) {
            if (this.isTiling) {
                (this.container as TilingSprite).tilePosition.x += delta.x;
            } else {
                this.container.position.x += delta.x;
            }
        }
    }

    moveTo(point: Point) {
        this.container.x = point.x;
        this.container.y = point.y;
    }

    destroy() {
        this.container.destroy({children: true, texture: true});
    }

    setTexture(texture: Texture) {
        if (this.container instanceof Sprite) {
            this.container.texture = texture;
        }
    }

    addChild(gameObject: GraphicsObject | GameObject) {
        if (gameObject instanceof GameObject) {
            this.container.addChild(gameObject.container);
        } else {
            this.container.addChild(gameObject.graphics);
        }

        this.children.push(gameObject);
    }

    removeChild(gameObject: GraphicsObject | GameObject) {
        if (this.children.indexOf(gameObject) === -1) { return; }

        let index: number;

        if (gameObject instanceof GameObject) {
            index = this.container.getChildIndex(gameObject.container);
        } else {
            index = this.container.getChildIndex(gameObject.graphics);
        }

        this.children.splice(this.children.indexOf(gameObject), 1);
        this.container.removeChildAt(index);
    }

    clone(): GameObject {
        let clone: GameObject;
        if (this.container instanceof Sprite) {
            clone = new GameObject(new Sprite(this.container.texture));
        } else {
            clone = new GameObject(this.container);
        }
        clone.speed = this.speed;

        clone.container.x = this.container.x;
        clone.container.y = this.container.y;
        clone.scale = this.scale ? new Point(this.scale.x, this.scale.y) : new Point(1, 1);
        clone.container.scale = this.scale;
        clone.id = this.id;
        
        Array.from(this.roles).forEach(role => clone.roles.add(role));

        if (this.collisionBox) {
            clone.collisionBox =  this.collisionBox;
        }

        return clone;
    }

    fromJson(json: SpriteObjectJson) {
        if (json.roles.indexOf(GameObjectRole.Background) !== -1) {
            this.isTiling = true;
        }

        this.scale = json.scale ? new Point(json.scale, json.scale) : new Point(1, 1);
        this.container.scale = this.scale;
        this.id = json.frameName || json.name;
        this.speed = new Point(json.speedX, json.speedY);
        json.roles.forEach(role => this.roles.add(<GameObjectRole> role));

        if (this.type === GameObjectType.GameObject) {
            this.container.position.x = json.viewportX;
            this.container.position.y = json.viewportY;
        }

        if (json.collisionBox) {
            const [x, y, width, height] = json.collisionBox.split(' ').map(val => parseInt(val, 10));
            this.collisionBox = new Rectangle(x, y, width * this.scale.x, height * this.scale.y);
        }
    }
}