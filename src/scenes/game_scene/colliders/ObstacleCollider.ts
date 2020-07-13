import { Registry } from "../../../Registry";
import { GameObjectRole, GameObjectTag } from "../../../model/SpriteObject";

export class ObstacleCollider {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
        
    checkCollisions() {
        const collidedObj = this.registry.stores.game.getByRole(GameObjectRole.Obstacle).find(obstacle => obstacle.tags.has(GameObjectTag.Collided)); 
        if (collidedObj && !collidedObj.tags.has(GameObjectTag.CollisionSuspended)) {
            collidedObj.tags.add(GameObjectTag.CollisionSuspended);
            this.registry.stores.scoreStore.setLives(this.registry.stores.scoreStore.getLives() - 1);
        }    
    }
}