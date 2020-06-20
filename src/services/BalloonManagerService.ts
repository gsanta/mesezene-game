import { GameScript } from "../model/GameScript";
import { Registry } from "../Registry";
import { GameObject } from "../model/GameObject";
import { Point } from "pixi.js";

export class BalloonManagerService extends GameScript {
    constructor(registry: Registry) {
        super(registry);
    }

    awake() {
        let maxX = this.getMaxX(); 
        while (maxX < this.registry.services.scene.sceneDimensions.x - 200) {
            maxX = this.generateRandomBalloon([maxX, maxX + 200]);
        }
    }

    update() {
        let maxX = this.getMaxX(); 
        
        if (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
            this.generateRandomBalloon([this.registry.services.scene.sceneDimensions.x - 100, this.registry.services.scene.sceneDimensions.x - 50]);
        }

        this.cleanupSprites();
    }

    private cleanupSprites() {
        const invalidBalloons = this.registry.services.scene.balloons.filter(balloon => balloon.getPosition().x + balloon.getDimensions().width < 0);
        this.registry.services.scene.balloons = this.registry.services.scene.balloons.filter(balloon => invalidBalloons.indexOf(balloon) === -1);
        this.registry.services.scene.application.stage.removeChild(...invalidBalloons.map(balloon => balloon.sprite));
    }

    private generateRandomBalloon(xRange: [number, number]): number {
        const balloonRegistry = this.registry.services.scene.balloonRegistry;
        const gameObject = balloonRegistry[Math.floor(balloonRegistry.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
        gameObject.verticalLayer = Math.floor(Math.random() * 3);

        const layerBorders = this.registry.services.scene.layers[gameObject.verticalLayer];
        // gameObject.setPosition(new Point(gameObject.getPosition().x, 500));
        gameObject.setPosition(new Point(gameObject.getPosition().x, layerBorders.toY - 10 - gameObject.getDimensions().height));


        // gameObject.sprite.scale = new Point(0.3 + gameObject.verticalLayer * 0.1, 0.3 + gameObject.verticalLayer * 0.1);
    
        this.registry.services.scene.sprites.push(gameObject);
        this.registry.services.scene.balloons.push(gameObject);
        this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostBalloon = this.getRightMostBalloon();
        const maxX = rightMostBalloon ? rightMostBalloon.getPosition().x + rightMostBalloon.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostBalloon(): GameObject {
        const balloons = this.registry.services.scene.balloons;
        balloons.sort((a: GameObject, b: GameObject) => a.getPosition().x - b.getPosition().x);

        return balloons.length > 0 ? balloons[balloons.length - 1] : undefined;
    }
}