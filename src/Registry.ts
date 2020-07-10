import { GameWindow } from "./GameWindow";
import { Services } from "./Services";
import { GameScript } from "./model/GameScript";
import { ScoreStore } from "./stores/ScoreStore";
import { AppStore } from "./stores/AppStore";
import { MessageStore } from "./stores/MessageStore";
import { Stores } from "./Stores";

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