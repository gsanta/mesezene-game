import { AbstractStore } from "./AbstractStore";
import { SpriteObject, GameObjectRole } from "../model/SpriteObject";
import { PlayerSprite } from "../scenes/game_scene/PlayerSprite";


export class GameObjectStore extends AbstractStore {
    private gameObjects: SpriteObject[] = [];

    getByRole(role: GameObjectRole): SpriteObject[] {
        return this.gameObjects.filter(gameObject => gameObject.roles.has(role));
    }

    add(gameObject: SpriteObject) {
        this.gameObjects.push(gameObject);
    }

    remove(gameObject: SpriteObject) {
        this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
    }

    getAll() {
        return this.gameObjects;
    }
}