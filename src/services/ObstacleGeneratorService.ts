import { Registry } from "../Registry";
import { GameObject } from "../model/GameObject";
import { Point } from "pixi.js";
import { ServiceCapability, IService } from "./IService";
import { IListener } from "./EventService";
import { SceneActions } from "./SceneService";

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
        const invalidPlatforms = this.registry.stores.game.platforms.filter(platform => platform.getPosition().x + platform.getDimensions().width < 0);
        this.registry.stores.game.platforms = this.registry.stores.game.platforms.filter(platform => invalidPlatforms.indexOf(platform) === -1);
        this.registry.services.scene.application.stage.removeChild(...invalidPlatforms.map(platform => platform.sprite));
    }

    private generateRandomPlatform(xRange: [number, number]): number {
        const platformRegistry = this.registry.stores.template.platformRegistry;
        const gameObject = platformRegistry[Math.floor(platformRegistry.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
        gameObject.verticalLayer = Math.floor(Math.random() * 3);

        const layerBorders = this.registry.services.scene.layers[gameObject.verticalLayer];
        gameObject.setPosition(new Point(gameObject.getPosition().x, layerBorders.toY - 10 - gameObject.getDimensions().height));

        // gameObject.sprite.scale = new Point(0.3 + gameObject.verticalLayer * 0.1, 0.3 + gameObject.verticalLayer * 0.1);
    
        this.registry.stores.game.sprites.push(gameObject);
        this.registry.stores.game.platforms.push(gameObject);
        this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostPlatform = this.getRightMostPlatform();
        const maxX = rightMostPlatform ? rightMostPlatform.getPosition().x + rightMostPlatform.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostPlatform(): GameObject {
        const platforms = this.registry.stores.game.platforms;
        platforms.sort((a: GameObject, b: GameObject) => a.getPosition().x - b.getPosition().x);

        return platforms.length > 0 ? platforms[platforms.length - 1] : undefined;
    }
}