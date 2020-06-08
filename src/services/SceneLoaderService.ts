import { Registry } from "../Registry";
import { Application, Loader, Sprite } from "pixi.js";
import { GameScript } from "../model/GameScript";
import { GameObject, GameObjectJson } from "../model/GameObject";

const sprites: GameObjectJson[] = [
    {
        x: 0,
        y: 96,
        scale: 0.4,
        path: "assets/sprites/balloon2.png"
    }
];

export class SceneLoaderService extends GameScript {
    application: Application;
    private loader: Loader;
    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;

        this.application = new Application({width: 256, height: 256});
    }

    load() {
        this.registry.gameWindow.htmlElement.appendChild(this.application.view);
        this.loader = new Loader();
    
        //load an image and run the `setup` function when it's done
        this.loader
            .add(sprites.map(sprite => sprite.path))
            .load(() => {
                this.setup();
                this.registry.gameScripts.forEach(script => script.awake());
            });
    }

    private setup() {
        sprites.forEach(spriteJson => {
            const gameObject = new GameObject(new Sprite(this.loader.resources[spriteJson.path].texture));
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