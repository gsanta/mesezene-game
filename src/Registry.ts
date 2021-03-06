import { GameWindow } from "./GameWindow";
import { GameScript } from "./model/GameScript";
import { Services } from "./Services";
import { Stores } from "./Stores";

export const gameConfig = {
    width: 700,
    height: 700
}

export class Registry {
    gameScripts: GameScript[] = [];
    gameWindow: GameWindow;
    services: Services;
    stores: Stores;

    constructor() {
        this.gameWindow = new GameWindow(this);
        this.stores = new Stores(this);
        this.services = new Services(this);
    }
}