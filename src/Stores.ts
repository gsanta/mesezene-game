import { ScoreStore } from "./stores/ScoreStore";
import { AppStore } from "./stores/AppStore";
import { MessageStore } from "./stores/MessageStore";
import { Registry } from "./Registry";
import { GameObjectStore } from "./stores/GameObjectStore";
import { LayerStore } from "./stores/LayerStore";

export class Stores {
    scoreStore: ScoreStore;
    appStore: AppStore;
    messageStore: MessageStore;
    template: GameObjectStore;

    layer: LayerStore;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.scoreStore = new ScoreStore(this.registry);
        this.appStore = new AppStore();
        this.messageStore = new MessageStore();
        this.template = new GameObjectStore(this.registry);
        this.layer = new LayerStore();
    }
}