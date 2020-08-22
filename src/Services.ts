import { Registry } from "./Registry";
import { GamepadService } from "./services/GamepadService";
import { IService, ServiceCapability } from "./services/IService";
import { KeyboardService } from "./services/KeyboardService";
import { RenderService } from "./services/RenderService";
import { SceneService } from "./services/SceneService";
import { UserService } from "./services/UserService";
import { MenuService } from "./services/MenuService";

export class Services {
    private registry: Registry;

    keyboard: KeyboardService;
    gamepad: GamepadService;
    scene: SceneService;
    menu: MenuService;
    loginService: UserService;
    renderService: RenderService;

    services: IService[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
        this.keyboard = new KeyboardService(registry);
        this.gamepad = new GamepadService(registry);
        this.scene = new SceneService(registry);
        this.menu = new MenuService(registry);
        this.loginService = new UserService(registry);
        this.renderService = new RenderService();

    }
}