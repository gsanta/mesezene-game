import { GameScript } from "../model/GameScript";
import { Registry } from "../Registry";
import { GameObject } from "../model/GameObject";
import { Point } from "pixi.js";

export class PlatformManagerService extends GameScript {
    constructor(registry: Registry) {
        super(registry);
    }

    awake() {
        let maxX = this.getMaxX(); 
        while (maxX < this.registry.services.scene.sceneDimensions.x - 200) {
            maxX = this.generateRandomPlatform([maxX, maxX + 200]);
        }

        this.generateRandomPlatform([maxX, maxX + 200]);
    }

    update() {
        let maxX = this.getMaxX(); 
        
        if (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
            this.generateRandomPlatform([this.registry.services.scene.sceneDimensions.x - 100, this.registry.services.scene.sceneDimensions.x - 50]);
        }

        this.cleanupSprites();
    }

    private cleanupSprites() {
        const invalidPlatforms = this.registry.services.scene.platforms.filter(platform => platform.getPosition().x + platform.getDimensions().x < 0);
        this.registry.services.scene.platforms = this.registry.services.scene.platforms.filter(platform => invalidPlatforms.indexOf(platform) === -1);
    }

    private generateRandomPlatform(xRange: [number, number]): number {
        const platformRegistry = this.registry.services.scene.platformRegistry;
        const gameObject = platformRegistry[Math.floor(platformRegistry.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
    
        this.registry.services.scene.sprites.push(gameObject);
        this.registry.services.scene.platforms.push(gameObject);
        this.registry.services.scene.application.stage.addChild(gameObject.sprite);

        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostPlatform = this.getRightMostPlatform();
        const maxX = rightMostPlatform ? rightMostPlatform.getPosition().x + rightMostPlatform.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostPlatform(): GameObject {
        const platforms = this.registry.services.scene.platforms;
        platforms.sort((a: GameObject, b: GameObject) => a.getPosition().x - b.getPosition().x);

        return platforms.length > 0 ? platforms[platforms.length - 1] : undefined;
    }
}