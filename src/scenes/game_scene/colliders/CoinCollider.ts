import { GameObjectRole } from "../../../model/GameObject";
import { AbstractCollider } from "./AbstractCollider";

export class CoinCollider extends AbstractCollider {
    
    checkCollisions() {
        const coin = this.calculateCollision();

        let balloons = this.scene.spriteStore.getByRole(GameObjectRole.Coin); 
    
        // const collidedBalloons = balloons.filter(balloon => balloon.tags.has(GameObjectTag.Collided));
    
        // collidedObj.forEach(coin => {
        if (coin) {
            this.scene.spriteStore.remove(coin);
            const layerContainer = this.scene.getLayerContainer();
    
            this.scene.laneManager.lanes[coin.layer].removeChild(coin);
        }
        // });
    }

    protected getCollidingObjects() {
        return this.scene.spriteStore.getByRole(GameObjectRole.Coin).filter(gameObject => gameObject.layer === this.scene.player.layer);
    }
}