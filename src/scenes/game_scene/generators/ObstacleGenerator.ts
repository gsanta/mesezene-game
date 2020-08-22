import { GameObject, GameObjectRole } from "../../../model/GameObject";
import { AbstractGameObjectGenerator } from "./AbstractGameObjectGenerator";

export class ObstacleGenerator extends AbstractGameObjectGenerator {
    // update() {
    //     this.removeSpritesNotOnScreen();
    //     this.generateNewSpritesIfNeeded();
    // }

    // generateNewSpritesIfNeeded() {
    //     let maxX = this.getMaxX(); 

    //     while (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
    //         maxX = this.generateRandomPlatform([maxX, maxX + 200]);
    //     }
    // }

    // private removeSpritesNotOnScreen() {
    //     const obstacles = this.scene.spriteStore.getByRole(GameObjectRole.Obstacle);
    //     const invalidPlatforms = obstacles.filter(platform => platform.getDimensions().x + platform.getDimensions().width < 0);
    //     invalidPlatforms.forEach(obstacle => {
    //         this.scene.spriteStore.remove(obstacle);

    //         this.scene.laneManager.lanes[obstacle.layer].removeChild(obstacle);
    //     });
    // }

    // private generateRandomPlatform(xRange: [number, number]): number {
    //     const obstacleTemplates = this.registry.stores.template.getByRole(GameObjectRole.Obstacle);
    //     const gameObject = obstacleTemplates[Math.floor(obstacleTemplates.length * Math.random())].clone();
    //     const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
    //     const yPos = (this.scene.laneManager.max - this.scene.laneManager.min) * Math.random() + this.scene.laneManager.min; 
    //     gameObject.moveTo(new Point(xPos, yPos));
    //     this.scene.laneManager.addGameObject(gameObject);

    //     this.scene.spriteStore.add(gameObject);
    //     return gameObject.getDimensions().x + gameObject.getDimensions().x;
    // }

    // private getMaxX(): number {
    //     const rightMostPlatform = this.getRightMostObject();
    //     const maxX = rightMostPlatform ? rightMostPlatform.getDimensions().x + rightMostPlatform.getDimensions().x : 0;
    //     return maxX;
    // }

    // private getRightMostObject(): GameObject {
    //     const platforms = this.scene.spriteStore.getByRole(GameObjectRole.Obstacle);
    //     this.getexplatforms.sort((a: GameObject, b: GameObject) => a.getDimensions().x - b.getDimensions().x);

    //     return platforms.length > 0 ? platforms[platforms.length - 1] : undefined;
    // }

    protected getExistingGeneratedObjects(): GameObject[] {
        return this.scene.spriteStore.getByRole(GameObjectRole.Obstacle);
    }

    protected getObjectTempaltes(): GameObject[] {
        return this.registry.stores.template.getByRole(GameObjectRole.Obstacle);
    }
}