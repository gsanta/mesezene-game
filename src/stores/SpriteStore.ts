import { AbstractStore } from "./AbstractStore";
import { GameObject, GameObjectRole } from "../model/GameObject";

export class SpriteStore extends AbstractStore {
    private gameObjects: GameObject[] = [];

    getByRole(role: GameObjectRole): GameObject[] {
        return this.gameObjects.filter(gameObject => gameObject.roles.has(role));
    }

    getByName(name: string): GameObject[] {
        return this.gameObjects.filter(gameObject => gameObject.id === name);
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

    clear() {

        // TODO get rid of 'remaininGameObjects': e.g put those sprites into an other store 
        const remaininGameObjects: GameObject[] = [];
        this.gameObjects.forEach(spriteObject =>  {
            if (!spriteObject.roles.has(GameObjectRole.Template)) {
                remaininGameObjects.push(spriteObject);
            }
        });
        this.gameObjects = remaininGameObjects;;
    }
}