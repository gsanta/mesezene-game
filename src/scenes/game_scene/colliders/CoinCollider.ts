import { GameObjectRole, GameObjectTag } from "../../../model/GameObject";
import { Registry } from "../../../Registry";
import { GameScene } from "../GameScene";

export class CoinCollider {
    private registry: Registry;
    private scene: GameScene;

    constructor(scene: GameScene, registry: Registry) {
        this.registry = registry;
        this.scene = scene;
    }
    
    checkCollisions() {
        this.removeBalloon();
    }

    removeBalloon() {
        let balloons = this.scene.spriteStore.getByRole(GameObjectRole.Coin); 

        const collidedBalloons = balloons.filter(balloon => balloon.tags.has(GameObjectTag.Collided));

        collidedBalloons.forEach(coin => {
            this.scene.spriteStore.remove(coin);
            const layerContainer = this.registry.stores.layer.getContainer(this.scene.id);

            this.scene.laneManager.lanes[coin.layer].removeChild(coin);
        });
    }
}