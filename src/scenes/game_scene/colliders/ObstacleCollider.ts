import { Registry } from "../../../Registry";
import { GameObjectRole, GameObjectTag, SpriteObject } from "../../../model/SpriteObject";
import { AbstractScene } from "../../AbstractScene";

export class ObstacleCollider {
    private registry: Registry;
    private scene: AbstractScene;

    constructor(scene: AbstractScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }
        
    checkCollisions(): SpriteObject | null {
        const collidedObj = this.scene.spriteStore.getByRole(GameObjectRole.Obstacle).find(obstacle => obstacle.tags.has(GameObjectTag.Collided)); 
        if (collidedObj && !collidedObj.tags.has(GameObjectTag.CollisionSuspended)) {
            collidedObj.tags.add(GameObjectTag.CollisionSuspended);
            return collidedObj;
        }    
    }
}