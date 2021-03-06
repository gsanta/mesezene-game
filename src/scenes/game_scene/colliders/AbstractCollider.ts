
import { GameObject, GameObjectRole, GameObjectTag } from "../../../model/GameObject";
import { Registry } from "../../../Registry";
import { CollisionRect, willCollideDiag, willCollideH, willCollideY } from "../../../services/collisions";
import { ServiceCapability } from "../../../services/IService";
import { GameScene } from "../GameScene";
import { GameSceneId } from "../GameSceneState";


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

export abstract class AbstractCollider {
    capabilities = [ServiceCapability.Listen];

    protected registry: Registry;
    protected scene: GameScene;

    constructor(scene: GameScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    calculateCollision(): GameObject {
        if (!this.registry.services.scene.isActiveScene(GameSceneId)) { return; }
    
        const player = this.scene.spriteStore.getByRole(GameObjectRole.Player)[0];
        const playerCollisionBox = player.getCollisionBox();

        // const collidableObjs = [...this.registry.services.scene.getActiveScene(false).spriteStore.getByRole(GameObjectRole.Coin), ...this.registry.services.scene.getActiveScene(false).spriteStore.getByRole(GameObjectRole.Obstacle)];
        const collidingObjects = this.getCollidingObjects();

        const collidedObj = collidingObjects
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

        return collidedObj;
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
        } else {
            collision = {
                h: diag ? diag.h : 0,
                v: 0,
                gameObject
            }
        }

        return collision;
    }

    protected abstract getCollidingObjects(): GameObject[];
}
