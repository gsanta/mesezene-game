import { Registry } from "../../../Registry";
import { GameObjectRole, GameObjectTag, GameObject } from "../../../model/GameObject";
import { AbstractScene } from "../../AbstractScene";

export class ObstacleCollider {
    private registry: Registry;
    private scene: AbstractScene;

    constructor(scene: AbstractScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }
        
    checkCollisions(): GameObject | null {
        const collidedObj = this.scene.spriteStore.getByRole(GameObjectRole.Obstacle).find(obstacle => obstacle.tags.has(GameObjectTag.Collided)); 
        if (collidedObj && !collidedObj.tags.has(GameObjectTag.CollisionSuspended)) {
            collidedObj.tags.add(GameObjectTag.CollisionSuspended);
            return collidedObj;
        }    
    }
}