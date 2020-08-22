import { MenuItemGraphics } from "./MenuItemGraphics";
import { Registry } from "../../Registry";
import { MenuScene, MenuItemId } from "./MenuScene";
import { Point, Graphics } from "pixi.js";
import { Layer } from "../../stores/LayerContainer";

export class MenuGraphics {
    private layerId: string;

    menuItems: MenuItemGraphics[];

    private menuScene: MenuScene;
    private registry: Registry;

    constructor(menuScene: MenuScene, registry: Registry, layerId: string) {
        this.menuScene = menuScene;
        this.registry = registry;
        this.layerId = layerId; 
    }
    
    draw() {
        this.clear();
        // TODO find a better place
        const application = this.registry.services.scene.application;
        this.menuScene.getLayerContainer().addLayer(new Layer(this.layerId, application));

        const dimensions = this.registry.services.scene.sceneDimensions;
        let position = new Point(dimensions.x / 2 - this.menuScene.size.x / 2, 0);
    
        const graphics = new Graphics();
        graphics.lineStyle(4, 0x424a3f, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(position.x, position.y, this.menuScene.size.x, this.menuScene.size.y);
        graphics.endFill();
    
        this.menuScene.getLayerContainer().getLayerById(this.layerId).addGraphics(graphics)
    
        position.y += 95;
    
        this.menuItems.forEach(menuItem => {
            this.menuScene.getLayerContainer().getLayerById(this.layerId).addGraphics(menuItem.draw(position));
            position.y += menuItem.size.y;
            position.y += 30;
        });
    }

    private clear() {
        const container = this.menuScene.getLayerContainer(); 
        if (container) {
            container.container.removeChildren();
            container.removeAllLayers();
        }
        this.menuScene.spriteStore.clear();
    }
}