import { Point } from "pixi.js";
import { GameObjectRole, GameObject } from "../../../model/GameObject";
import { Registry } from "../../../Registry";
import { GameScene } from "../GameScene";
import { AbstractGameObjectGenerator } from "./AbstractGameObjectGenerator";

export class CoinGenerator extends AbstractGameObjectGenerator {
    // tick() {
    //     // this.removeSpritesNotOnScreen();
    //     let maxX = this.getMaxX(); 
    
    //     while (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
    //         maxX = this.generateRandomOjbect([maxX, maxX + 200]);
    //     }
    // }

    // removeSpritesNotOnScreen() {
    //     const invalidBalloons = this.scene.spriteStore.getByRole(GameObjectRole.Coin).filter(balloon => balloon.getDimensions().x + balloon.getDimensions().width < 0);
    //     invalidBalloons.forEach(removable => {
    //         this.scene.spriteStore.remove(removable);

    //         this.scene.laneManager.lanes[removable.layer].removeChild(removable);
    //     });

    //     this.registry.services.scene.application.stage.removeChild(...invalidBalloons.map(balloon => balloon.container));
    // }

    // private generateRandomOjbect(xRange: [number, number]): number {
    //     const obstacleTemplates = this.registry.stores.template.getByRole(GameObjectRole.Coin);
    //     const gameObject = obstacleTemplates[Math.floor(obstacleTemplates.length * Math.random())].clone();
        
    //     const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
    //     const yPos = (this.scene.laneManager.max - this.scene.laneManager.min) * Math.random() + this.scene.laneManager.min; 
    //     gameObject.moveTo(new Point(xPos, yPos));
    //     this.scene.laneManager.addGameObject(gameObject);

    //     this.scene.spriteStore.add(gameObject);
        
    //     return gameObject.getDimensions().x + gameObject.getDimensions().x;
    // }

    // private getMaxX(): number {
    //     const rightMostBalloon = this.getRightMostBalloon();
    //     const maxX = rightMostBalloon ? rightMostBalloon.getDimensions().x + rightMostBalloon.getDimensions().x : 0;
    //     return maxX;
    // }

    // private getRightMostBalloon(): GameObject {
    //     const balloons = this.scene.spriteStore.getByRole(GameObjectRole.Coin);
    //     balloons.sort((a: GameObject, b: GameObject) => a.getDimensions().x - b.getDimensions().x);

    //     return balloons.length > 0 ? balloons[balloons.length - 1] : undefined;
    // }

    protected getExistingGeneratedObjects(): GameObject[] {
        return this.scene.spriteStore.getByRole(GameObjectRole.Coin);
    }

    protected getObjectTempaltes(): GameObject[] {
        return this.registry.stores.template.getByRole(GameObjectRole.Coin);
    }
}