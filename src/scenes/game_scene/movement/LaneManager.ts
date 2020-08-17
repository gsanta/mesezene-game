import { PlayerSprite } from "../PlayerSprite";
import { Point } from "pixi.js";
import { GameScene } from "../GameScene";
import { Registry } from "../../../Registry";
import { SpriteObject } from "../../../model/SpriteObject";
import { LaneObject } from "../../../model/LaneObject";

export class LaneManager {
    private player: PlayerSprite;
    private scene: GameScene;
    private registry: Registry;

    private lane: SpriteObject;
    activeLayerIndex: number;

    private lanes: LaneObject[] = [];
    activeLane: LaneObject;

    constructor(lanes: LaneObject[], scene: GameScene, registry: Registry) {
        this.lanes = lanes;
        this.scene = scene;
        this.registry = registry;
    }
    
    draw() {
        this.scene.getLayerContainer().getLayerById('background-layer').addChild(this.lane);
        this.lanes.forEach(lane => {
            lane.graphics.draw()
        });
    }

    setPlayer(player: PlayerSprite) {
        this.player = player;
    }

    move() {
        let speed = new Point(this.player.speed.x, this.player.speed.y);

        if (this.player.container.x < this.scene.horizontalBorders[0] && this.player.speed.x < 0) {
            speed.x = 0;
        } else if (this.player.container.x + this.player.container.width > this.scene.horizontalBorders[1] && this.player.speed.x > 0) {
            speed.x = 0;
        }
        
        if (this.player.container.y < this.scene.vertialBorders[0] && speed.y < 0) {
            speed.y = 0;
        } else if (this.player.container.y > this.scene.vertialBorders[1] && this.player.speed.y > 0) {
            speed.y = 0;
        }
        
        this.player.move(speed);

        this.updateVerticalLayer();
    }

    private updateVerticalLayer() {
        const y = this.player.container.y + this.player.currentJumpY + this.player.container.height;

        this.activeLane = this.lanes.find(lane => lane.isWithinRange(y)) || this.lanes[0];
    }
}