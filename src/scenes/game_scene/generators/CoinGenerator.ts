import { Point } from "pixi.js";
import { GameObjectRole, SpriteObject } from "../../../model/SpriteObject";
import { Registry } from "../../../Registry";
import { GameScene } from "../GameScene";

export class CoinGenerator {
    private registry: Registry;
    private scene: GameScene;

    constructor(scene: GameScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    update() {
        this.removeSpritesNotOnScreen();
        this.generateNewSpritesIfNeeded();
    }

    generateNewSpritesIfNeeded() {
        let maxX = this.getMaxX(); 

        while (maxX < this.scene.sceneDimensions.x - 320) {
            maxX = this.generateRandomObstacle([maxX, maxX + 200]);
        }
    }

    removeSpritesNotOnScreen() {
        const invalidBalloons = this.registry.stores.game.getByRole(GameObjectRole.Coin).filter(balloon => balloon.getPosition().x + balloon.getDimensions().width < 0);
        invalidBalloons.forEach(removable => {
            this.registry.stores.game.remove(removable);
            this.registry.stores.layer.getLayerById(removable.layer).removeChild(removable);
        });

        this.scene.application.stage.removeChild(...invalidBalloons.map(balloon => balloon.sprite));
    }

    private generateRandomObstacle(xRange: [number, number]): number {
        const obstacleTemplates = this.registry.stores.template.getByRole(GameObjectRole.Coin);
        const gameObject = obstacleTemplates[Math.floor(obstacleTemplates.length * Math.random())].clone();
        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        gameObject.setPosition(new Point(xPos, gameObject.getPosition().y));
        const layerIndex = Math.floor(Math.random() * 3) + 1;
        gameObject.layer = `game-layer-${layerIndex}`; 

        const layer = this.registry.stores.layer.getLayerById(gameObject.layer);
        gameObject.setPosition(new Point(gameObject.getPosition().x, layer.range[1] * this.scene.sceneDimensions.y - 10 - gameObject.getDimensions().height));

        this.registry.stores.game.add(gameObject);
        layer.addChild(gameObject);
        return gameObject.getPosition().x + gameObject.getDimensions().x;
    }

    private getMaxX(): number {
        const rightMostBalloon = this.getRightMostBalloon();
        const maxX = rightMostBalloon ? rightMostBalloon.getPosition().x + rightMostBalloon.getDimensions().x : 0;
        return maxX;
    }

    private getRightMostBalloon(): SpriteObject {
        const balloons = this.registry.stores.game.getByRole(GameObjectRole.Coin);
        balloons.sort((a: SpriteObject, b: SpriteObject) => a.getPosition().x - b.getPosition().x);

        return balloons.length > 0 ? balloons[balloons.length - 1] : undefined;
    }
}