import { Loader, Point, Sprite, TilingSprite } from "pixi.js";
import { GameObject, GameObjectJson, GameObjectRole } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { MesezeneGlobals } from "../model/MesezeneGlobals";
import { Player } from "../model/Player";
import { TilingGameObject } from "../model/TilingGameObject";
import { SceneActions } from "../actions/SceneActions";

declare const mesezeneGlobals: MesezeneGlobals;

export interface AppJson {
    width: number;
    height: number;
    gameSpeed: number;
    spriteSheet: string;
    sprites: GameObjectJson[];
}

export const appJson: AppJson = {
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
            roles: []
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
            roles: []
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
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/kutya.png",
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            roles: []
        }
    ]
}

export class SceneLoaderService extends GameScript {
    private loader: Loader;

    load(appJson: AppJson): Promise<void> {
        const application = this.registry.services.scene.application;
        
        return new Promise((resolve, reject) => {
            this.registry.gameWindow.htmlElement.appendChild(application.view);
            this.loader = new Loader();
    
            this.loader
                .add(appJson.sprites.filter(sprite => sprite.path).map(sprite => `${mesezeneGlobals.urlPrefix}/${sprite.path}`))
                .add(`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`)
                .load(() => {
                    this.setupSprites(appJson);
                    this.registry.services.event.dispatch(SceneActions.SCENE_LOADED);
                })
                .on('error', (e) => {
                    this.registry.stores.messageStore.gameError = e.message;
                    this.registry.services.event.dispatch(SceneActions.SCENE_LOADING_ERROR);
                });
        });
    }

    private setupSprites(appJson: AppJson) {
        const application = this.registry.services.scene.application;

        appJson.sprites.forEach(spriteJson => {
            let gameObject: GameObject;

            if (spriteJson.isBackgroundImage) {
                const texture = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture;
                gameObject = new TilingGameObject(new TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height));
                gameObject.fromJson(spriteJson);
                this.registry.stores.layer.getLayerById(gameObject.layer).addChild(gameObject);
            } else if (spriteJson.frameName) {
                const sheet = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`];

                if (spriteJson.frameName.startsWith('platform')) {
                    gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject.fromJson(spriteJson);
                    this.registry.stores.template.platformRegistry.push(gameObject);    
                } else if (spriteJson.frameName.startsWith('balloon')) {
                    gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject.fromJson(spriteJson);
                    this.registry.stores.template.balloonRegistry.push(gameObject);    
                } else if (spriteJson.frameName.startsWith('player')) {
                    this.registry.stores.game.player = new Player(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject = this.registry.stores.game.player;
                    gameObject.fromJson(spriteJson);
                    this.registry.stores.layer.getLayerById(gameObject.layer).addChild(gameObject);
                }
                this.registry.stores.template.addTemplate(gameObject);
            } else {
                gameObject = new GameObject(new Sprite(this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture));
                gameObject.fromJson(spriteJson);
                application.stage.addChild(gameObject.sprite);
            }

            if (gameObject.roles.has(GameObjectRole.Template)) {
                this.registry.stores.template.addTemplate(gameObject);
            } else {
                this.registry.stores.game.add(gameObject);
            }
        });
    }
}