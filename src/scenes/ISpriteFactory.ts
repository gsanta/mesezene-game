import { Sprite } from "pixi.js";
import { SpriteObjectJson } from "../model/GameObject";

export interface ISpriteFactory {
    getInstance(spriteJson: SpriteObjectJson, pixieSprite: Sprite);
}