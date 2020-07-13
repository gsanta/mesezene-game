import { Sprite } from "pixi.js";
import { SpriteObjectJson } from "../model/SpriteObject";

export interface ISpriteFactory {
    getInstance(spriteJson: SpriteObjectJson, pixieSprite: Sprite);
}