import { GameWindow } from "./GameWindow";
import { Services } from "./Services";
import { GameScript } from "./model/GameScript";

export class Registry {
    gameScripts: GameScript[] = [];
    gameWindow: GameWindow;
    services: Services;

    constructor() {
        this.gameWindow = new GameWindow(this);
        this.services = new Services(this);
    }
}