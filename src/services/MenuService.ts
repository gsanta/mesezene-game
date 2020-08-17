import { MenuScene } from "../scenes/menu_scene/MenuScene";
import { Registry } from "../Registry";





export class MenuService {

    private menuScene: MenuScene;

    constructor(registry: Registry) {
        this.menuScene = new MenuScene(registry);
    }
}
