import { SpriteObjectJson, SpriteObject, GameObjectRole } from "../../model/SpriteObject";
import { Loader, Sprite } from "pixi.js";
import { PlayerSprite } from "./PlayerSprite";
import { TilingGameObject } from "../../model/TilingGameObject";

export class GameSpriteFactory {

    getInstance(spriteJson: SpriteObjectJson, pixieSprite: Sprite): SpriteObject {
        let spriteObject: SpriteObject;
        if (spriteJson.roles.indexOf(GameObjectRole.Player) !== -1) {
            spriteObject = new PlayerSprite(pixieSprite);
        } else if (spriteJson.roles.indexOf(GameObjectRole.Background) !== -1) {
            spriteObject = new TilingGameObject(pixieSprite);
        } else {
            spriteObject = new SpriteObject(pixieSprite);
        }

        spriteObject.fromJson(spriteJson);

        return spriteObject;
    }

}