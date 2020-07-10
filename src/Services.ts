import { KeyboardService } from "./services/KeyboardService";
import { GamepadService } from "./services/GamepadService";
import { Registry } from "./Registry";
import { SceneService } from "./services/SceneService";
import { SceneLoaderService } from "./services/SceneLoaderService";
import { PlatformManagerService } from "./services/PlatformManagerService";
import { ObstacleGeneratorService } from "./services/ObstacleGeneratorService";
import { UserService } from "./services/UserService";
import { RenderService } from "./services/RenderService";
import { EventService, IListener } from "./services/EventService";
import { IService, ServiceCapability } from "./services/IService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    loader: SceneLoaderService;
    platformManager: PlatformManagerService;
    obstacle: ObstacleGeneratorService;
    loginService: UserService;
    renderService: RenderService;
    event: EventService;

    private services: IService[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
        this.event = new EventService(registry);
        this.keyboard = new KeyboardService(registry);
        this.gamepad = new GamepadService(registry);
        this.scene = new SceneService(registry);
        this.loader = new SceneLoaderService(registry);
        this.platformManager = new PlatformManagerService(registry);
        this.obstacle = new ObstacleGeneratorService(registry);
        this.loginService = new UserService(registry);
        this.renderService = new RenderService();

        this.services.push(this.obstacle);

        this.setupListeners();
    }

    private setupListeners() {
        this.services.forEach(service => {
            if (ServiceCapability.hasCapability(service, ServiceCapability.Listen)) {
                this.event.addListener(<IListener> <unknown> service);
            }
        });
    }
}