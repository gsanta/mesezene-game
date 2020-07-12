import { CollisionRect, willCollideH, willCollideY, willCollideDiag } from "./collisions";
import { Registry } from "../Registry";
import { GameObject, GameObjectTag, GameObjectRole } from "../model/GameObject";
import { IListener } from "./EventService";
import { IService, ServiceCapability } from "./IService";
import { SceneActions } from "../actions/SceneActions";

export interface Collision {
    v: number;
    h: number;
    gameObject: GameObject;
}

export interface CharacterCollisions {
    platform: Collision;
}

export const CharacterCollisionRect = {
    Width: 30,
    Height: 50
};

export const createCenteredCollisionBox = (box: CollisionRect) => {
    return {
        x: box.x - box.width / 2,
        y: box.y - box.height / 2,
        width: box.width,
        height: box.height
    };
};

export enum CollisionActions {
    PLAYER_COLLIDED = 'PLAYER_COLLIDED'
}

export class CollisionService implements IListener, IService {
    capabilities = [ServiceCapability.Listen];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    listen(action: string) {
        switch (action) {
            case SceneActions.SCENE_UPDATE:
                this.calculateCollision();
            break;
        }
    }

    calculateCollision(): void {
        const player = this.registry.stores.game.player;

        const playerCollisionBox = player.getCollisionBox();



        const collidableObjs = [...this.registry.stores.game.getByRole(GameObjectRole.Coin), ...this.registry.stores.game.getByRole(GameObjectRole.Obstacle)];

        const collidedObj = collidableObjs
            .filter(obj => obj.layer === player.layer)
            .filter(obj => !obj.tags.has(GameObjectTag.Collided))
            .find(platform => {
                const platformCollisionBox = platform.getCollisionBox();

                const collision = this.getObjectCollision(playerCollisionBox, platformCollisionBox, 1, 1, platform);

                if (collision && (collision.h || collision.v)) {
                    collision.gameObject.tags.add(GameObjectTag.Collided);
                    return true;
                }
                return false;
            });

        if (collidedObj) {
            this.registry.services.event.dispatch(CollisionActions.PLAYER_COLLIDED);
        }
    }

    private getObjectCollision(box1: CollisionRect, box2: CollisionRect, predictedVx: number, predictedVy: number, gameObject: GameObject): Collision {
        const horizontal = willCollideH(box1, box2, predictedVx);
        const vertical = willCollideY(box1, box2, predictedVy);
        const diag = willCollideDiag(box1, box2, predictedVx, predictedVy);

        let collision: Collision = undefined;

        if (horizontal || vertical) {
            collision = {
                h: horizontal ? horizontal : 0,
                v: vertical ? vertical : 0,
                gameObject
            };
            console.log(collision)
        } else {
            collision = {
                h: diag ? diag.h : 0,
                v: 0,
                gameObject
            }
        }

        return collision;
    }
}
