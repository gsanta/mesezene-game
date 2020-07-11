import { IListener } from "../EventService";
import { IService, ServiceCapability } from "../IService";
import { CollisionActions } from "../CollisionService";
import { Registry } from "../../Registry";
import { GameObjectTag } from "../../model/GameObject";


export class BalloonColliderService implements IListener, IService {
    capabilities = [ServiceCapability.Listen];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    listen(action: string) {
        switch(action) {
            case CollisionActions.PLAYER_COLLIDED:
                this.removeBalloon();
            break;
        }
    }

    removeBalloon() {
        let balloons = this.registry.stores.game.balloons; 
        this.registry.stores.scoreStore.setScores(this.registry.stores.scoreStore.getScores() + 1);

        const collidedBalloons = balloons.filter(balloon => balloon.tags.has(GameObjectTag.Collided));

        this.registry.stores.game.balloons = balloons.filter(balloon => collidedBalloons.indexOf(balloon) === -1);

        collidedBalloons.forEach(balloon => {
            this.registry.services.scene.layerContainers[balloon.verticalLayer].removeChild(balloon.sprite);
        });
    }
}