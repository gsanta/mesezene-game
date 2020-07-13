import { KeyboardService } from "./services/KeyboardService";
import { GamepadService } from "./services/GamepadService";
import { Registry } from "./Registry";
import { SceneService } from "./services/SceneService";
import { SceneLoader } from "./scenes/SceneLoader";
import { BalloonGeneratorService } from "./services/BalloonGeneratorService";
import { UserService } from "./services/UserService";
import { RenderService } from "./services/RenderService";
import { EventService, IListener } from "./services/EventService";
import { IService, ServiceCapability } from "./services/IService";
import { BalloonColliderService } from "./services/collision/BalloonColliderService";
import { ObstacleColliderService } from "./services/collision/ObstacleColliderService";
import { ObstacleGeneratorService } from "./services/ObstacleGeneratorService";
import { CollisionService } from "./services/CollisionService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    balloon: BalloonGeneratorService;
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
        this.balloon = new BalloonGeneratorService(registry);
        this.loginService = new UserService(registry);
        this.renderService = new RenderService();

        this.services.push(
            new CollisionService(this.registry),
            this.balloon,
            new BalloonColliderService(this.registry),
            new ObstacleColliderService(this.registry),
            new ObstacleGeneratorService(this.registry),
            this.scene
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