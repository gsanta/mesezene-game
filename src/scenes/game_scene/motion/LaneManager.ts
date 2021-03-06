import { Point } from "pixi.js";
import { GameScene } from "../GameScene";
import { Registry, gameConfig } from "../../../Registry";
import { GameObject, GameObjectRole } from "../../../model/GameObject";
import { LaneObject } from "../../../model/LaneObject";

export class LaneManager {
    player: GameObject;
    private scene: GameScene;
    private registry: Registry;

    activeLayerIndex: number;

    min: number;
    max: number;
    laneHeight: number;

    lanes: LaneObject[] = [];
    activeLane: LaneObject;

    private laneRanges: [number, number][];

    private colors: string[] = ['#ff0000', '#00ff00'];

    constructor(scene: GameScene, registry: Registry, laneRanges: [number, number][]) {
        this.scene = scene;
        this.registry = registry;
        this.min = laneRanges[0][0];
        this.max = laneRanges[laneRanges.length - 1][1];
        this.laneRanges = laneRanges;
        this.laneHeight = (this.max - this.min) / laneRanges.length;
    }
    
    draw() {
        this.lanes = this.laneRanges.map((range, index) => {
            const lane = new LaneObject(range, (index % 2 === 0) ? this.colors[0] : this.colors[1]);
            
            this.scene.getLayerContainer().getLayerById('game-layer').addChild(lane);
    
            return lane;
        });
        // this.scene.getLayerContainer().getLayerById('background-layer').addChild(this.lane);
        this.lanes.forEach((lane, index) => {
            lane.graphics.draw()
        });
    }

    addGameObject(gameObject: GameObject) {
        // const y = gameObject.getDimensions().y;

        // const lane = this.lanes.find(lane => lane.isWithinRange(y));
        // lane.addChild(gameObject);
        // gameObject.layer = this.lanes.indexOf(lane);
    }

    updateGameObject(gameObject: GameObject) {
        const y = gameObject.getDimensions().bottom() + this.scene.jumpMotion.currentJumpY;

        const laneIndex = this.lanes.findIndex(lane => lane.isWithinRange(y));

        if (gameObject.layer !== laneIndex) {
            gameObject.layer = laneIndex;
        }
    }

    move() {
        let speed = new Point(this.player.speed.x, this.player.speed.y);

        if (this.player.container.x < 0 && this.player.speed.x < 0) {
            speed.x = 0;
        } else if (this.player.container.x + this.player.container.width > gameConfig.width && this.player.speed.x > 0) {
            speed.x = 0;
        }
        
        const y = (this.player.container.y + this.player.getDimensions().height) - this.scene.jumpMotion.currentJumpY;

        if (y <= this.min && speed.y < 0) {
            speed.y = 0;
        } else if (y >= this.max && this.player.speed.y > 0) {
            speed.y = 0;
        }
        
        this.player.moveWith(speed);

        this.updateVerticalLayer();
    }

    private updateVerticalLayer() {
        const y = this.player.container.y + this.scene.jumpMotion.currentJumpY + this.player.container.height;

        this.activeLane = this.lanes.find(lane => lane.isWithinRange(y)) || this.lanes[0];
    }
}