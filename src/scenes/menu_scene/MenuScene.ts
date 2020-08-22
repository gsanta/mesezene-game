import { Point } from "pixi.js";
import { Registry } from "../../Registry";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { GameSceneId } from "../game_scene/GameSceneState";
import { MapSceneId } from "../map_scene/MapScene";
import { AppJson, SceneLoader } from "../SceneLoader";
import { MenuGraphics } from "./MenuGraphics";
import { MenuItemGraphics } from "./MenuItemGraphics";
import { MenuSceneId } from "./MenuSceneState";

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
    menu: MenuGraphics;

    menus = {
        game: [
            MenuItemId.GameResume,
            MenuItemId.GameRestart,
            MenuItemId.WorldMap
        ],
        gameOver: [
            MenuItemId.GameRestart,
            MenuItemId.WorldMap
        ],
        worldMap: [
            MenuItemId.GameStart,
        ]
    }

    constructor(registry: Registry) {
        super(registry, appJson);

        this.menu = new MenuGraphics(this, registry, 'main');

        this.loader = new SceneLoader(this, this.registry);

        this.spriteStore = new SpriteStore(this.registry);

        this.menuItems.set(MenuItemId.GameStart, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Játék',
                action: () => {
                    this.registry.services.scene.activateScene(GameSceneId);
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
                    this.registry.services.scene.activateScene(GameSceneId);
                    this.hide();
                }
            }
        ));

        this.menuItems.set(MenuItemId.WorldMap, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Lufivilág',
                action: () => {
                    this.registry.services.scene.activateScene(MapSceneId);
                    this.hide();
                }
            }
        ));

        this.menuItems.set(MenuItemId.GameResume, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Folytatom',
                action: () => {
                    this.hide();
                    this.registry.services.scene.gameScene.resume();
                }
            }
        ));

        this.menuItems.set(MenuItemId.GameExit, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#e26b58',
                label: 'Befejezem',
                action: () => {
                    this.registry.services.scene.activateScene(MapSceneId);
                }
            }
        ));

        this.setMenu(this.menus.worldMap);
    }

    setMenu(menuItemIds: MenuItemId[]) {
        this.menu.menuItems = [];
        menuItemIds.forEach(id => this.menu.menuItems.push(this.menuItems.get(id)));
    }

    doActivate() {}

    doDraw() {
        this.menu.draw();
    }

    doUpdate() {}
}