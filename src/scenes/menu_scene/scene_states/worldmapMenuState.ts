import { Registry } from "../../../Registry";
import { SceneState } from "../../AbstractScene";
import { MenuItemId, MenuScene } from "../MenuScene";
import { MenuSceneId, MenuSceneState } from "../MenuSceneState";

export const worldmapMenuState = new SceneState(MenuSceneId, MenuSceneState.WorldMapState)
    .onDraw((menuScene: MenuScene, registry: Registry) => {
        menuScene.menu.menuItems = [
            menuScene.menuItems.get(MenuItemId.GameStart)
        ];

        menuScene.menu.draw();
    });