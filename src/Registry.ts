import { PixieApp } from "./PixieApp";
import { GameWindow } from "./GameWindow";

export class Registry {
    app: PixieApp;
    gameWindow: GameWindow;

    constructor() {
        this.app = new PixieApp();
        this.gameWindow = new GameWindow(this);
    }
}