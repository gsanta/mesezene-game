import { KeyboardService } from "./services/KeyboardService";
import { GamepadService } from "./services/GamepadService";
import { Registry } from "./Registry";
import { SceneService } from "./services/SceneService";
import { SceneLoaderService } from "./services/SceneLoaderService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    loader: SceneLoaderService;

    constructor(registry: Registry) {
        this.registry = registry;
        this.keyboard = new KeyboardService(registry);
        this.gamepad = new GamepadService(registry);
        this.scene = new SceneService(registry);
        this.loader = new SceneLoaderService(registry);
    }
}