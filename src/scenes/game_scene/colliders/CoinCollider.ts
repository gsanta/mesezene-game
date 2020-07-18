import { GameObjectRole, GameObjectTag } from "../../../model/SpriteObject";
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
        this.registry.stores.scoreStore.setScores(this.registry.stores.scoreStore.getScores() + 1);

        const collidedBalloons = balloons.filter(balloon => balloon.tags.has(GameObjectTag.Collided));

        collidedBalloons.forEach(coin => {
            this.scene.spriteStore.remove(coin);
            this.scene.layerStore.getLayerById(coin.layer).removeChild(coin);
        });
    }
}