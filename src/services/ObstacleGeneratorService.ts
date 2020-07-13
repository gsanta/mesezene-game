import { Registry } from "../Registry";
import { SpriteObject, GameObjectRole } from "../model/SpriteObject";
import { Point } from "pixi.js";
import { ServiceCapability, IService } from "./IService";
import { IListener } from "./EventService";
import { SceneActions } from "../actions/SceneActions";

export class ObstacleGeneratorService implements IListener, IService {
    capabilities = [ServiceCapability.Listen];
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    listen(action: string) {
        switch(action) {
            case SceneActions.SCENE_START:
            case SceneActions.SCENE_UPDATE:
                this.removeSpritesNotOnScreen();
                this.generateNewSpritesIfNeeded();
            break;
        }
    }

    generateNewSpritesIfNeeded() {
        let maxX = this.getMaxX(); 

        while (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
            maxX = this.generateRandomPlatform([maxX, maxX + 200]);
        }
    }


    // awake() {
    //     let maxX = this.getMaxX(); 
    //     while (maxX < this.registry.services.scene.sceneDimensions.x - 200) {
    //         maxX = this.generateRandomPlatform([maxX, maxX + 200]);
    //     }
    // }

    // update() {
    //     let maxX = this.getMaxX(); 
        
    //     if (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
    //         this.generateRandomPlatform([this.registry.services.scene.sceneDimensions.x - 100, this.registry.services.scene.sceneDimensions.x - 50]);
    //     }

    //     this.cleanupSprites();
    // }

    private removeSpritesNotOnScreen() {
        const obstacles = this.registry.stores.game.getByRole(GameObjectRole.Obstacle);
        const invalidPlatforms = obstacles.filter(platform => platform.getPosition().x + platform.getDimensions().width < 0);
        invalidPlatforms.forEach(obstacle => {
            this.registry.stores.game.remove(obstacle);
            this.registry.stores.layer.getLayerById(obstacle.layer).removeChild(obstacle);
        });
    }

    private generateRandomPlatform(xRange: [number, number]): number {
        const obstacleTemplates = this.registry.stores.template.getByRole(GameObjectRole.Obstacle);
        const gameObject = obstacleTemplates[Math.floor(obstacleTemplates.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
        const layerIndex = Math.floor(Math.random() * 3) + 1;
        gameObject.layer = `game-layer-${layerIndex}`

        const layer = this.registry.stores.layer.getLayerById(gameObject.layer);
        gameObject.setPosition(new Point(gameObject.getPosition().x, layer.range[1] * this.registry.services.scene.sceneDimensions.y - 10 - gameObject.getDimensions().height));

        // gameObject.sprite.scale = new Point(0.3 + gameObject.verticalLayer * 0.1, 0.3 + gameObject.verticalLayer * 0.1);

        this.registry.stores.game.add(gameObject);
        layer.addChild(gameObject);
        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostPlatform = this.getRightMostPlatform();
        const maxX = rightMostPlatform ? rightMostPlatform.getPosition().x + rightMostPlatform.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostPlatform(): SpriteObject {
        const platforms = this.registry.stores.game.getByRole(GameObjectRole.Obstacle);
        platforms.sort((a: SpriteObject, b: SpriteObject) => a.getPosition().x - b.getPosition().x);

        return platforms.length > 0 ? platforms[platforms.length - 1] : undefined;
    }
}