import { SceneState } from "../../AbstractScene";
import { MenuSceneId, MenuSceneState } from "../MenuSceneState";
import { MenuScene, MenuItemId } from "../MenuScene";
import { Registry } from "../../../Registry";
import { LayerContainer, Layer } from "../../../stores/LayerContainer";
import { Point, Graphics } from "pixi.js";

export const worldmapMenuState = new SceneState(MenuSceneId, MenuSceneState.WorldMapState)
    .onDraw((menuScene: MenuScene, registry: Registry) => {
        menuScene.reset();
        const container = new LayerContainer(menuScene.id, registry);
        registry.stores.layer.addContainer(container);
        const application = registry.services.scene.application;

        container.addLayer(new Layer('main', [0, 1], application));

        const dimensions = registry.services.scene.sceneDimensions;
        let position = new Point(dimensions.x / 2 - menuScene.size.x / 2, 0);

        const graphics = new Graphics();
        graphics.lineStyle(4, 0x424a3f, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(position.x, position.y, menuScene.size.x, menuScene.size.y);
        graphics.endFill();

        menuScene.getLayerContainer().getLayerById('main').addGraphics(graphics)

        position.y += 95;

        menuScene.activeMenuItems = [
            menuScene.menuItems.get(MenuItemId.GameStart)
        ];
        
        menuScene.activeMenuItems.forEach(menuItem => {
            menuScene.getLayerContainer().getLayerById('main').addGraphics(menuItem.draw(position));
            position.y += menuItem.size.y;
            position.y += 30;
        });
    });