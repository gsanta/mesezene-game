import { GameObject } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { Point } from "pixi.js";

export class SceneService extends GameScript {
    sprites: GameObject[] = [];

    player: GameObject;

    awake() {
        this.registry.services.loader.application.ticker.add(delta => {
            this.registry.gameScripts.forEach(script => script.update(delta));
        });
    }

    update() {
        // this.player.moveWithVelocity();

        // this.getSpriteByName('middle-layer').move();
        // this.getSpriteByName('background-layer').move();
    }

    private getSpriteByName(name: string) {
        return this.sprites.find(sprite => sprite.name === name);
    }
}