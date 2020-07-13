import { GameObjectRole, GameObjectTag } from "../../../model/SpriteObject";
import { Registry } from "../../../Registry";

export class CoinCollider {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    checkCollisions() {
        this.removeBalloon();
    }

    removeBalloon() {
        let balloons = this.registry.stores.game.getByRole(GameObjectRole.Coin); 
        this.registry.stores.scoreStore.setScores(this.registry.stores.scoreStore.getScores() + 1);

        const collidedBalloons = balloons.filter(balloon => balloon.tags.has(GameObjectTag.Collided));

        collidedBalloons.forEach(coin => {
            this.registry.stores.game.remove(coin);
            this.registry.stores.layer.getLayerById(coin.layer).removeChild(coin);
        });
    }
}