import { IListener } from "../EventService";
import { IService, ServiceCapability } from "../IService";
import { CollisionActions } from "../CollisionService";
import { Registry } from "../../Registry";


export class ObstacleColliderService implements IListener, IService {
    capabilities = [ServiceCapability.Listen];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    listen(action: string) {
        switch(action) {
            case CollisionActions.PLAYER_COLLIDED:
                this.registry.stores.scoreStore.setLives(this.registry.stores.scoreStore.getLives() - 1);
            break;
        }
    }
}