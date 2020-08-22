import { Loader, Sprite, TilingSprite } from "pixi.js";
import { SceneActions } from "../actions/SceneActions";
import { MesezeneGlobals } from "../model/MesezeneGlobals";
import { GameObjectRole, GameObject, SpriteObjectJson } from "../model/GameObject";
import { Registry } from "../Registry";
import { AbstractScene } from "./AbstractScene";

declare const mesezeneGlobals: MesezeneGlobals;

export interface AppJson {
    width: number;
    height: number;
    gameSpeed?: number;
    spriteSheet: string;
    sprites: SpriteObjectJson[];
}

export class SceneLoader {
    private loader: Loader;
    private scene: AbstractScene;
    private registry: Registry;

    constructor(scene: AbstractScene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    load(appJson: AppJson): Promise<void> {        
        this.loader = new Loader();

        return new Promise((resolve, reject) => {

            this.loader.add(appJson.sprites.filter(sprite => sprite.path).map(sprite => `${mesezeneGlobals.urlPrefix}/${sprite.path}`))

            if (appJson.spriteSheet) {
                this.loader.add(`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`);
            }
            
            this.loader
            .load(() => {
                this.setupSprites(appJson);
                resolve();
            })
            .on('error', (e) => {
                this.registry.stores.messageStore.gameError = e.message;
                reject(e);
            });
        });

    }

    private setupSprites(appJson: AppJson) {
        appJson.sprites.forEach(spriteJson => {
            let sprite: Sprite;
                        
            if (spriteJson.roles.indexOf(GameObjectRole.Background) !== -1) {
                const texture = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture;
                sprite = new TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height);
            } else if (spriteJson.frameName) {
                const sheet = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`];
                sprite = new Sprite(sheet.textures[spriteJson.frameName]);
                this.scene.textureStore.addTexture(spriteJson.frameName, sheet.textures[spriteJson.frameName]);
            }
            
            let gameObject: GameObject = new GameObject(sprite);
            gameObject.fromJson(spriteJson);

            if (gameObject.roles.has(GameObjectRole.Template)) {
                this.registry.stores.template.add(gameObject);
            } else {
                this.scene.spriteStore.add(gameObject);
            }
        });
    }
}