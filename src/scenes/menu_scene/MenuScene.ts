import { Point } from "pixi.js";
import { Registry } from "../../Registry";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { GameSceneState } from "../game_scene/GameSceneState";
import { AppJson, SceneLoader } from "../SceneLoader";
import { MenuItemGraphics } from "./MenuItemGraphics";
import { MenuSceneId } from "./MenuSceneState";
import { gameOverMenuState } from "./scene_states/gameOverMenuState";
import { worldmapMenuState } from "./scene_states/worldmapMenuState";
import { WorldMapState } from "../map_scene/scene_states/WorldMapState";

export enum MenuItemId {
    GameResume = 'GameResume',
    GameExit = 'GameExit',
    GameStart = 'GameStart',
    GameRestart = 'GameRestart',
    WorldMap = 'WorldMap'
}

export const toHexNumber = (hexString: string): number => {
    return parseInt(hexString.replace(/^#/, ''), 16);
}

export const appJson: AppJson = {
    width: 700,
    height: 700,
    spriteSheet: undefined,
    sprites: []
}

export class MenuScene extends AbstractScene {
    id = MenuSceneId;
    isOverlay = true;
    size = new Point(700, 700);

    menuItems: Map<MenuItemId, MenuItemGraphics> = new Map();
    activeMenuItems: MenuItemGraphics[] = [];

    constructor(registry: Registry) {
        super(registry, appJson);

        this.loader = new SceneLoader(this, this.registry);

        this.spriteStore = new SpriteStore(this.registry);

        this.menuItems.set(MenuItemId.GameStart, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Játék',
                action: () => {
                    this.registry.services.scene.gameScene.activate(GameSceneState.Running);
                }
            }
        ));

        this.menuItems.set(MenuItemId.GameRestart, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Újra',
                action: () => {
                    this.registry.services.scene.gameScene.activate(GameSceneState.Running);
                }
            }
        ));

        this.menuItems.set(MenuItemId.WorldMap, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#50863b',
                label: 'Lufivilág',
                action: () => {
                    this.registry.services.scene.mapScene.activate(WorldMapState.DefaultState);
                }
            }
        ));

        this.menuItems.set(MenuItemId.GameResume, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#50863b',
                label: 'Folytatom',
                action: () => {
                    this.registry.services.scene.mapScene.activate(WorldMapState.DefaultState);
                }
            }
        ));

        this.menuItems.set(MenuItemId.GameExit, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#50863b',
                label: 'Befejezem',
                action: () => {
                    this.registry.services.scene.mapScene.activate(WorldMapState.DefaultState);
                }
            }
        ));

        this.sceneStates.set(gameOverMenuState.stateId, gameOverMenuState);
        this.sceneStates.set(worldmapMenuState.stateId, worldmapMenuState);
    }
}