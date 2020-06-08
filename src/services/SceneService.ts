import { GameObject } from "../model/GameObject";
import { GameScript } from "../model/GameScript";

export class SceneService extends GameScript {
    sprites: GameObject[] = [];

    player: GameObject;

    awake() {
        this.registry.services.loader.application.ticker.add(delta => {
            this.registry.gameScripts.forEach(script => script.update(delta));
        });
    }

    update() {
        this.player.moveWithVelocity();
    }
}