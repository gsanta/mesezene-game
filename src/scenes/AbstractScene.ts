import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader, AppJson } from "./SceneLoader";
import { Application } from "pixi.js";


export abstract class AbstractScene {
    application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;

    abstract setup(appJson: AppJson): void;
}