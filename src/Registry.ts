import { GameWindow } from "./GameWindow";
import { Services } from "./Services";
import { GameScript } from "./model/GameScript";
import { ScoreStore } from "./stores/ScoreStore";
import { AppStore } from "./stores/AppStore";
import { MessageStore } from "./stores/MessageStore";

export class Registry {
    gameScripts: GameScript[] = [];
    gameWindow: GameWindow;
    services: Services;
    scoreStore: ScoreStore;
    appStore: AppStore;
    messageStore: MessageStore;

    constructor() {
        this.gameWindow = new GameWindow(this);
        this.services = new Services(this);
        this.scoreStore = new ScoreStore();
        this.appStore = new AppStore();
        this.messageStore = new MessageStore();
    }
}