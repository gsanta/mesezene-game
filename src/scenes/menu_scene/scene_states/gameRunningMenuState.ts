import { Registry } from "../../../Registry";
import { SceneState } from "../../AbstractScene";
import { MenuItemId, MenuScene } from "../MenuScene";
import { MenuSceneId, MenuSceneState } from "../MenuSceneState";

export const gameRunningMenuState = new SceneState(MenuSceneId, MenuSceneState.GameRunningMenuState)
    .onDraw((menuScene: MenuScene, registry: Registry) => {
        menuScene.menu.menuItems = [
            menuScene.menuItems.get(MenuItemId.GameResume),
            menuScene.menuItems.get(MenuItemId.GameRestart),
            menuScene.menuItems.get(MenuItemId.WorldMap)
        ];
        menuScene.menu.draw();
    })