import { Loader, Point, Sprite, TilingSprite } from "pixi.js";
import { GameObject, GameObjectJson } from "../model/GameObject";
import { GameScript } from "../model/GameScript";
import { MesezeneGlobals } from "../model/MesezeneGlobals";
import { Player } from "../model/Player";
import { TilingGameObject } from "../model/TilingGameObject";

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
            isTiling: true,
            speedX: -0.64,
            speedY: 0,
            viewportX: 0,
            viewportY: 0
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            path: "assets/sprites/middle.png",
            name: 'middle-layer',
            isTiling: true,
            speedX: -1.28,
            speedY: 0,
            viewportX: 0,
            viewportY: 0
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_01',
            name: 'front-layer',
            isTiling: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_02',
            name: 'front-layer',
            isTiling: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470
        },
        {
            x: 0,
            y: 0,
            scale: 0.4,
            frameName: 'platform_03',
            name: 'front-layer',
            isTiling: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'balloon_01',
            name: 'front-layer',
            isTiling: false,
            speedX: -1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 470,
            // collisionBox: "0 0 67 80"
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'player',
            name: 'front-layer',
            isTiling: false,
            speedX: 0,
            speedY: 0,
            viewportX: 32,
            viewportY: 470
        }
    ]
}

export class SceneLoaderService extends GameScript {
    private loader: Loader;

    load(appJson: AppJson) {
        const application = this.registry.services.scene.application;

        this.registry.gameWindow.htmlElement.appendChild(application.view);
        this.loader = new Loader();

        this.setupScene(appJson);

        this.loader
            .add(appJson.sprites.filter(sprite => sprite.path).map(sprite => `${mesezeneGlobals.urlPrefix}/${sprite.path}`))
            .add(`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`)
            .load(() => {
                this.setupSprites(appJson);
                this.registry.gameScripts.forEach(script => script.awake());
            })
            .on('error', (e) => console.log(e));
    }

    private setupScene(appJson: AppJson) {
        this.registry.services.scene.sceneDimensions = new Point(appJson.width, appJson.height);

        this.registry.services.scene.gameSpeed = appJson.gameSpeed;
        this.registry.services.scene.application.renderer.resize(appJson.width, appJson.height);
    }

    private setupSprites(appJson: AppJson) {
        const application = this.registry.services.scene.application;

        appJson.sprites.forEach(spriteJson => {
            let gameObject: GameObject;

            if (spriteJson.isTiling) {
                const texture = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture;
                gameObject = new TilingGameObject(new TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height));
                gameObject.fromJson(spriteJson);
                this.registry.services.scene.backgroundContainer.addChild(gameObject.sprite);
            } else if (spriteJson.frameName) {
                const sheet = this.loader.resources[`${mesezeneGlobals.urlPrefix}/${appJson.spriteSheet}`];
                
                if (spriteJson.frameName.startsWith('platform')) {
                    gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject.fromJson(spriteJson);
                    this.registry.services.scene.platformRegistry.push(gameObject);    
                } else if (spriteJson.frameName.startsWith('balloon')) {
                    gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject.fromJson(spriteJson);
                    this.registry.services.scene.balloonRegistry.push(gameObject);    
                } else if (spriteJson.frameName.startsWith('player')) {
                    this.registry.stores.game.player = new Player(new Sprite(sheet.textures[spriteJson.frameName]));
                    gameObject = this.registry.stores.game.player;
                    gameObject.fromJson(spriteJson);
                    this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
                    // application.stage.addChild(gameObject.sprite);
                }
            } else {
                gameObject = new GameObject(new Sprite(this.loader.resources[`${mesezeneGlobals.urlPrefix}/${spriteJson.path}`].texture));
                gameObject.fromJson(spriteJson);
                application.stage.addChild(gameObject.sprite);
            }

            this.registry.stores.game.sprites.push(gameObject);
        });

    //     .add("assets/sprites/balloon2.png")
    //     .load(setup);
    }
}