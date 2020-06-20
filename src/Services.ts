import { KeyboardService } from "./services/KeyboardService";
import { GamepadService } from "./services/GamepadService";
import { Registry } from "./Registry";
import { SceneService } from "./services/SceneService";
import { SceneLoaderService } from "./services/SceneLoaderService";
import { PlatformManagerService } from "./services/PlatformManagerService";
import { CollisionService } from "./services/CollisionService";
import { BalloonManagerService } from "./services/BalloonManagerService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    loader: SceneLoaderService;
    platformManager: PlatformManagerService;
    balloonManager: BalloonManagerService;
    collision: CollisionService;

    constructor(registry: Registry) {
        this.registry = registry;
        this.keyboard = new KeyboardService(registry);
        this.gamepad = new GamepadService(registry);
        this.scene = new SceneService(registry);
        this.loader = new SceneLoaderService(registry);
        this.platformManager = new PlatformManagerService(registry);
        this.collision = new CollisionService(registry);
        this.balloonManager = new BalloonManagerService(registry);
    }
}