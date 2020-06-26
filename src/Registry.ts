import { GameWindow } from "./GameWindow";
import { Services } from "./Services";
import { GameScript } from "./model/GameScript";
import { ScoreStore } from "./stores/ScoreStore";

export class Registry {
    gameScripts: GameScript[] = [];
    gameWindow: GameWindow;
    services: Services;
    scoreStore: ScoreStore;

    constructor() {
        this.gameWindow = new GameWindow(this);
        this.services = new Services(this);
        this.scoreStore = new ScoreStore();
    }
}