import { ISpriteFactory } from "./ISpriteFactory";
import { SceneLoader } from "./SceneLoader";
import { Application } from "pixi.js";


export class AbstractScene {
    application: Application;
    factory: ISpriteFactory;
    loader: SceneLoader;

}