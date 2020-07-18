import { Registry } from "./Registry";
import { CollisionService } from "./services/CollisionService";
import { EventService, IListener } from "./services/EventService";
import { GamepadService } from "./services/GamepadService";
import { IService, ServiceCapability } from "./services/IService";
import { KeyboardService } from "./services/KeyboardService";
import { RenderService } from "./services/RenderService";
import { SceneService } from "./services/SceneService";
import { UserService } from "./services/UserService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    loginService: UserService;
    renderService: RenderService;
    event: EventService;
    collision: CollisionService;

    services: IService[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
        this.event = new EventService(registry);
        this.keyboard = new KeyboardService(registry);
        this.gamepad = new GamepadService(registry);
        this.scene = new SceneService(registry);
        this.loginService = new UserService(registry);
        this.renderService = new RenderService();

        this.collision = new CollisionService(this.registry);
        this.services.push(
            this.collision
        );

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