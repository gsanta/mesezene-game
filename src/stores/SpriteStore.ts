import { AbstractStore } from "./AbstractStore";
import { SpriteObject, GameObjectRole } from "../model/SpriteObject";
import { PlayerSprite } from "../scenes/game_scene/PlayerSprite";


export class SpriteStore extends AbstractStore {
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

    clear() {

        // TODO get rid of 'remaininGameObjects': e.g put those sprites into an other store 
        const remaininGameObjects: SpriteObject[] = [];
        this.gameObjects.forEach(spriteObject =>  {
            if (!spriteObject.roles.has(GameObjectRole.Template)) {
                remaininGameObjects.push(spriteObject);
            }
        });
        this.gameObjects = remaininGameObjects;;
    }
}