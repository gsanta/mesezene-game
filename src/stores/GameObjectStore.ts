import { AbstractStore } from "./AbstractStore";
import { GameObject, GameObjectRole } from "../model/GameObject";
import { Player } from "../model/Player";


export class GameObjectStore extends AbstractStore {
    private gameObjects: GameObject[] = [];
    player: Player;

    getByRole(role: GameObjectRole): GameObject[] {
        return this.gameObjects.filter(gameObject => gameObject.roles.has(role));
    }

    add(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
    }

    remove(gameObject: GameObject) {
        this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
    }

    getAll() {
        return this.gameObjects;
    }
}