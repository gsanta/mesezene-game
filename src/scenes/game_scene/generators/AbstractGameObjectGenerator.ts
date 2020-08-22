import { Point } from "pixi.js";
import { GameObject } from "../../../model/GameObject";
import { Registry } from "../../../Registry";
import { GameScene } from "../GameScene";


export abstract class AbstractGameObjectGenerator {
    protected registry: Registry;
    protected scene: GameScene;

    constructor(scene: GameScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    tick() {        
        let maxX = this.getMaxX(); 
    
        while (maxX < this.registry.services.scene.sceneDimensions.x - 320) {
            maxX = this.generateObjectAtRandomPosition([maxX, maxX + 200]);
        }
    }

    private generateObjectAtRandomPosition(xRange: [number, number]): number {
        const obstacleTemplates = this.getObjectTempaltes();
        const selectedGameObject = obstacleTemplates[Math.floor(obstacleTemplates.length * Math.random())].clone();

        const xPos = Math.floor((xRange[1] - xRange[0]) * Math.random()) + xRange[0];
        const yPos = (this.scene.laneManager.max - this.scene.laneManager.min) * Math.random() + this.scene.laneManager.min;

        selectedGameObject.moveTo(new Point(xPos, yPos));
        this.scene.laneManager.addGameObject(selectedGameObject);

        this.scene.spriteStore.add(selectedGameObject);
        return selectedGameObject.getDimensions().right();
    }

    private getMaxX(): number {
        const existingGeneratedObjects = this.getExistingGeneratedObjects();

        if (existingGeneratedObjects.length === 0) { return 0; }

        this.getExistingGeneratedObjects().sort((a: GameObject, b: GameObject) => a.getDimensions().x - b.getDimensions().x);

        return existingGeneratedObjects[existingGeneratedObjects.length - 1].getDimensions().right();
    }

    protected abstract getExistingGeneratedObjects(): GameObject[];
    protected abstract getObjectTempaltes(): GameObject[];
}