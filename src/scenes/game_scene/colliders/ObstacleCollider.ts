import { GameObject, GameObjectRole, GameObjectTag } from "../../../model/GameObject";
import { AbstractCollider } from "./AbstractCollider";

export class ObstacleCollider extends AbstractCollider {

    checkCollisions(): GameObject | null {

        const collidedObj = this.calculateCollision();

        // const collidedObj = this.scene.spriteStore.getByRole(GameObjectRole.Obstacle).find(obstacle => obstacle.tags.has(GameObjectTag.Collided)); 
        if (collidedObj && !collidedObj.tags.has(GameObjectTag.CollisionSuspended)) {
            collidedObj.tags.add(GameObjectTag.CollisionSuspended);
            return collidedObj;
        }    
    }

    protected getCollidingObjects() {
        return this.scene.spriteStore.getByRole(GameObjectRole.Obstacle).filter(gameObject => gameObject.layer === this.scene.player.layer)
    }
}