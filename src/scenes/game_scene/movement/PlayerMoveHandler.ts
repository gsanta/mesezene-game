import { PlayerSprite } from "../PlayerSprite";
import { Point } from "pixi.js";
import { GameScene } from "../GameScene";
import { Registry } from "../../../Registry";


export class PlayerMoveHandler {
    private player: PlayerSprite;
    private scene: GameScene;
    private registry: Registry;

    constructor(scene: GameScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    setPlayer(player: PlayerSprite) {
        this.player = player;
    }

    move() {
        let speed = new Point(this.player.speed.x, this.player.speed.y);

        if (this.player.sprite.x < this.scene.horizontalBorders[0] && this.player.speed.x < 0) {
            speed.x = 0;
        } else if (this.player.sprite.x + this.player.sprite.width > this.scene.horizontalBorders[1] && this.player.speed.x > 0) {
            speed.x = 0;
        }
        
        if (this.player.sprite.y < this.scene.vertialBorders[0] && speed.y < 0) {
            speed.y = 0;
        } else if (this.player.sprite.y > this.scene.vertialBorders[1] && this.player.speed.y > 0) {
            speed.y = 0;
        }
        
        this.player.move(speed);

        this.updateVerticalLayer();
    }

    private updateVerticalLayer() {
        const gameContainer = this.registry.stores.layer.getContainer(this.scene.id);

        const y = this.player.sprite.y + this.player.currentJumpY + this.player.sprite.height;
        const normalizedY = y / this.registry.services.scene.sceneDimensions.y;

        const newLayer = gameContainer.layers.find(l => l.range[0] <= normalizedY && l.range[1] >= normalizedY);

        if (newLayer.id !== this.player.layer) {
            gameContainer.getLayerById(this.player.layer).removeChild(this.player);
            gameContainer.getLayerById(newLayer.id).addChild(this.player);
            this.player.layer = newLayer.id;
        }
    }
}