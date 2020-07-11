import { Point } from "pixi.js";
import { GameObject } from "../model/GameObject";
import { Registry } from "../Registry";
import { IListener } from "./EventService";
import { SceneActions } from "./SceneService";
import { IService, ServiceCapability } from "./IService";

export class BalloonGeneratorService implements IListener, IService {
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
            maxX = this.generateRandomObstacle([maxX, maxX + 200]);
        }
    }

    removeSpritesNotOnScreen() {
        const invalidBalloons = this.registry.stores.game.balloons.filter(balloon => balloon.getPosition().x + balloon.getDimensions().width < 0);
        this.registry.stores.game.balloons = this.registry.stores.game.balloons.filter(balloon => invalidBalloons.indexOf(balloon) === -1);
        this.registry.services.scene.application.stage.removeChild(...invalidBalloons.map(balloon => balloon.sprite));
    }

    private generateRandomObstacle(xRange: [number, number]): number {
        const balloonRegistry = this.registry.stores.template.balloonRegistry;
        const gameObject = balloonRegistry[Math.floor(balloonRegistry.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
        gameObject.verticalLayer = Math.floor(Math.random() * 3);

        const layerBorders = this.registry.services.scene.layers[gameObject.verticalLayer];
        gameObject.setPosition(new Point(gameObject.getPosition().x, layerBorders.toY - 10 - gameObject.getDimensions().height));

        this.registry.stores.game.gameObjects.push(gameObject);
        this.registry.stores.game.balloons.push(gameObject);
        this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostBalloon = this.getRightMostBalloon();
        const maxX = rightMostBalloon ? rightMostBalloon.getPosition().x + rightMostBalloon.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostBalloon(): GameObject {
        const balloons = this.registry.stores.game.balloons;
        balloons.sort((a: GameObject, b: GameObject) => a.getPosition().x - b.getPosition().x);

        return balloons.length > 0 ? balloons[balloons.length - 1] : undefined;
    }
}