import { AbstractStore } from "./AbstractStore";
import { Texture } from "pixi.js";


export class TextureStore extends AbstractStore {
    private textureMap: Map<string, Texture> = new Map();

    getByName(name: string): Texture {
        return this.textureMap.get(name);
    }

    addTexture(name: string, texture: Texture) {
        this.textureMap.set(name, texture);
    }
}
