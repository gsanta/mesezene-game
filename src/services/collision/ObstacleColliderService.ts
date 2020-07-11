import { IListener } from "../EventService";
import { IService, ServiceCapability } from "../IService";
import { CollisionActions } from "../CollisionService";
import { Registry } from "../../Registry";
import { GameObjectTag } from "../../model/GameObject";


export class ObstacleColliderService implements IListener, IService {
    capabilities = [ServiceCapability.Listen];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    listen(action: string) {
        switch(action) {
            case CollisionActions.PLAYER_COLLIDED:
                const collidedObj = this.registry.stores.game.obstacles.find(obstacle => obstacle.tags.has(GameObjectTag.Collided)); 
                if (collidedObj && !collidedObj.tags.has(GameObjectTag.CollisionSuspended)) {
                    collidedObj.tags.add(GameObjectTag.CollisionSuspended);
                    this.registry.stores.scoreStore.setLives(this.registry.stores.scoreStore.getLives() - 1);
                }
            break;
        }
    }
}