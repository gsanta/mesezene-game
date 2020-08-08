import { Loader, Sprite, TilingSprite } from "pixi.js";
import { SceneActions } from "../actions/SceneActions";
import { MesezeneGlobals } from "../model/MesezeneGlobals";
import { GameObjectRole, SpriteObject, SpriteObjectJson } from "../model/SpriteObject";
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

export const defaultAppJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/sprite-sheet.json',
    sprites: [
        // {
        //     x: 0,
        //     y: 96,
        //     scale: 0.4,
        //     path: "assets/sprites/balloon2.png",
        //     name: 'player',
        //     isTiling: false,
        //     speedX: 1,
        //     speedY: 1,
        //     viewportX: 0,
        //     viewportY: 0
        // },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/background.png",
            name: 'background-layer',
            isBackgroundImage: true,
            speedX: -0.64,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/middle.png",
            name: 'middle-layer',
            isBackgroundImage: true,
            speedX: -1.28,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_01',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_02',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_03',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Obstacle, GameObjectRole.Template]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'balloon_01',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Coin, GameObjectRole.Template]
            // collisionBox: "0 0 67 80"
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'player',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: [GameObjectRole.Player]
        },
        // {
        //     x: 0,
        //     y: 0,
        //     scale: 0.5,
        //     path: "assets/sprites/kutya.png",
        //     name: 'front-layer',
        //     isBackgroundImage: false,
        //     speedX: 0,
        //     speedY: 0,
        //     viewportX: 32,
        //     viewportY: 470,
        //     roles: []
        // }
    ]
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
                this.registry.services.event.dispatch(SceneActions.SCENE_LOADED);
            })
            .on('error', (e) => {
                this.registry.stores.messageStore.gameError = e.message;
                reject(e);
                this.registry.services.event.dispatch(SceneActions.SCENE_LOADING_ERROR);
            });
        });

    }

    private setupSprites(appJson: AppJson) {
        appJson.sprites.forEach(spriteJson => {
            let gameObject: SpriteObject;
            let sprite: Sprite;

            if (spriteJson.roles.indexOf(GameObjectRole.Background) !== -1) {
                const texture = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture;
                sprite = new TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height);
            } else if (spriteJson.frameName) {
                const sheet = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`];
                sprite = new Sprite(sheet.textures[spriteJson.frameName]);
                this.scene.textureStore.addTexture(spriteJson.frameName, sheet.textures[spriteJson.frameName]);
            }

            gameObject = this.scene.factory.getInstance(spriteJson, sprite);

            if (gameObject.roles.has(GameObjectRole.Template)) {
                this.registry.stores.template.add(gameObject);
            } else {
                this.scene.spriteStore.add(gameObject);
            }
        });
    }
}