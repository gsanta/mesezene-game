import { ScoreStore } from "./stores/ScoreStore";
import { AppStore } from "./stores/AppStore";
import { MessageStore } from "./stores/MessageStore";
import { Registry } from "./Registry";
import { GameStore } from "./stores/GameStore";

export class Stores {
    scoreStore: ScoreStore;
    appStore: AppStore;
    messageStore: MessageStore;
    game: GameStore;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.scoreStore = new ScoreStore(this.registry);
        this.appStore = new AppStore();
        this.messageStore = new MessageStore();
        this.game = new GameStore(this.registry);
    }
}