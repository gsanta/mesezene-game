import { Registry } from "../Registry";
import { Application, Loader, Sprite, TilingSprite } from "pixi.js";
import { GameScript } from "../model/GameScript";
import { GameObject, GameObjectJson } from "../model/GameObject";
import { TilingGameObject } from "../model/TilingGameObject";

export interface AppJson {
    width: number;
    height: number;
    gameSpeed: number;
    spriteSheet: string;
    sprites: GameObjectJson[];
}

export const appJson: AppJson = {
    width: 700,
    height: 600,
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
            speedX: 0.64,
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
            speedX: 1.28,
            speedY: 0,
            viewportX: 0,
            viewportY: 0
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'platform_01',
            name: 'front-layer',
            isTiling: false,
            speedX: 1.28,
            speedY: 0,
            viewportX: 32,
            viewportY: 500
        }
    ]
}

export class SceneLoaderService extends GameScript {
    application: Application;
    private loader: Loader;
    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;

        this.application = new Application({width: 256, height: 256});
    }

    load(appJson: AppJson) {
        this.registry.gameWindow.htmlElement.appendChild(this.application.view);
        this.loader = new Loader();

        this.setupScene(appJson);

        this.loader
            .add(appJson.sprites.filter(sprite => sprite.path).map(sprite => sprite.path))
            .add(appJson.spriteSheet)
            .load(() => {
                this.setupSprites(appJson);
                this.registry.gameScripts.forEach(script => script.awake());
            })
            .on('error', (e) => console.log(e));
    }

    private setupScene(appJson: AppJson) {
        this.registry.services.scene.gameSpeed = appJson.gameSpeed;
        this.registry.services.loader.application.renderer.resize(appJson.width, appJson.height);
    }

    private setupSprites(appJson: AppJson) {
        appJson.sprites.forEach(spriteJson => {
            let gameObject: GameObject;

            if (spriteJson.isTiling) {
                const texture = this.loader.resources[spriteJson.path].texture;
                gameObject = new TilingGameObject(new TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height));
            } else if (spriteJson.frameName) {
                const sheet = this.loader.resources[appJson.spriteSheet];
                gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
            } else {
                gameObject = new GameObject(new Sprite(this.loader.resources[spriteJson.path].texture));
            }

            gameObject.fromJson(spriteJson);
            this.registry.services.scene.sprites.push(gameObject);
            this.application.stage.addChild(gameObject.sprite);

        });

        this.registry.services.scene.player = this.registry.services.scene.sprites[0];
    // loader
    //     .add("assets/sprites/balloon2.png")
    //     .load(setup);
    }
}