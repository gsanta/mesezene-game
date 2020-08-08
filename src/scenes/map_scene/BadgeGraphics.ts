import { SpriteObject } from "../../model/SpriteObject";
import { Point } from "pixi.js";
import { TextureStore } from "../../stores/TextureStore";


export class BadgeGraphics {
    private mouseOverFunc: Function;
    private spriteObj: SpriteObject;

    constructor(spriteObject: SpriteObject, textureName: string, textureStore: TextureStore) {
        this.spriteObj = spriteObject;
        spriteObject.sprite.interactive = true;
        this.spriteObj.sprite.on('mouseover', () => {
            this.spriteObj.sprite.scale.set(0.6)
            this.spriteObj.sprite.texture = textureStore.getByName(`${textureName}_highlighted`);
        });

        this.spriteObj.sprite.on('mouseout', () => {
            this.spriteObj.sprite.scale.set(0.5)
            this.spriteObj.sprite.texture = textureStore.getByName(`${textureName}`);
        });
    }

    draw() {
    }
}