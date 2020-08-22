import { Point } from "pixi.js";
import { GameScene } from "../GameScene";
import { Registry, gameConfig } from "../../../Registry";
import { SpriteObject } from "../../../model/SpriteObject";
import { LaneObject } from "../../../model/LaneObject";

export class LaneManager {
    private player: SpriteObject;
    private scene: GameScene;
    private registry: Registry;

    private lane: SpriteObject;
    activeLayerIndex: number;

    lanes: LaneObject[] = [];
    activeLane: LaneObject;

    constructor(lanes: LaneObject[], scene: GameScene, registry: Registry) {
        this.lanes = lanes;
        this.scene = scene;
        this.registry = registry;
    }
    
    draw() {
        // this.scene.getLayerContainer().getLayerById('background-layer').addChild(this.lane);
        // this.lanes.forEach(lane => {
        //     lane.graphics.draw()
        // });
    }

    setPlayer(player: SpriteObject) {
        this.player = player;
    }

    move() {
        let speed = new Point(this.player.speed.x, this.player.speed.y);

        if (this.player.container.x < 0 && this.player.speed.x < 0) {
            speed.x = 0;
        } else if (this.player.container.x + this.player.container.width > gameConfig.width && this.player.speed.x > 0) {
            speed.x = 0;
        }
        
        if (this.player.container.y < this.lanes[0].range[0] && speed.y < 0) {
            speed.y = 0;
        } else if (this.player.container.y > this.lanes[this.lanes.length - 1].range[1] && this.player.speed.y > 0) {
            speed.y = 0;
        }
        
        this.player.move(speed);

        this.updateVerticalLayer();
    }

    private updateVerticalLayer() {
        const y = this.player.container.y + this.scene.jumpMotion.currentJumpY + this.player.container.height;

        this.activeLane = this.lanes.find(lane => lane.isWithinRange(y)) || this.lanes[0];
    }
}