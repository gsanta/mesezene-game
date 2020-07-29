import { AbstractScene, StateDescription } from "../AbstractScene";
import { Application, Graphics, Point, TextStyle, Text } from "pixi.js";
import { Registry } from "../../Registry";
import { LayerContainer, Layer } from "../../stores/LayerContainer";
import { AppJson, SceneLoader } from "../SceneLoader";
import { GameSceneId } from "../game_scene/GameScene";
import { MapSceneId } from "../map_scene/MapScene";
import { MenuItemGraphics } from "./MenuItemGraphics";

export enum MenuSceneStates {
    GameOver = 'GameOver'
}

export enum MenuItemId {
    GameResume = 'GameRestart',
    GameExit = 'GameExit',
    Game = 'Game',
    WorldMap = 'WorldMap'
}

const gameStates: StateDescription<MenuSceneStates>[] = [
    {
        stateId: MenuSceneStates.GameOver,
        overlay: null,

        apply(menuScene: MenuScene) {

            menuScene.activeMenuItems = [
                menuScene.menuItems.get(MenuItemId.GameResume),
                menuScene.menuItems.get(MenuItemId.GameExit),
            ]
        }
    }
];

export const toHexNumber = (hexString: string): number => {
    return parseInt(hexString.replace(/^#/, ''), 16);
}

export const appJson: AppJson = {
    width: 700,
    height: 700,
    spriteSheet: undefined,
    sprites: []
}

export const MenuSceneId = 'menu-scene';
export class MenuScene extends AbstractScene {
    id = MenuSceneId;
    private application: Application;
    private size = new Point(700, 700);

    menuItems: Map<MenuItemId, MenuItemGraphics> = new Map();
    activeMenuItems: MenuItemGraphics[] = [];

    constructor(registry: Registry) {
        super(registry, appJson);

        this.loader = new SceneLoader(this, this.registry);

        this.menuItems.set(MenuItemId.Game, new MenuItemGraphics(
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

        this.menuItems.set(MenuItemId.WorldMap, new MenuItemGraphics(
            this.size.x,
            {
                color: '#ffffff',
                hoveredColor: '#50863b',
                label: 'Lufivilág',
                action: () => {
                    this.registry.services.scene.activateScene(MapSceneId);
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
                    this.registry.services.scene.activateScene(MapSceneId);
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
                    this.registry.services.scene.activateScene(MapSceneId);
                }
            }
        ));
    }

    doDestroy() {}
    doUpdate() {
        
    }

    doInit() {
        const container = new LayerContainer(this.id, this.registry);
        this.registry.stores.layer.addContainer(container);
        const application = this.registry.services.scene.application;

        container.addLayer(new Layer('main', [0, 1], application));

        this.drawBackground();
    }

    private drawBackground(): void {
        const dimensions = this.registry.services.scene.sceneDimensions;
        let position = new Point(dimensions.x / 2 - this.size.x / 2, 0);

        const graphics = new Graphics();
        graphics.lineStyle(4, 0x424a3f, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(position.x, position.y, this.size.x, this.size.y);
        graphics.endFill();

        this.getLayerContainer().getLayerById('main').addGraphics(graphics);

        position.y += 95;        
        this.activeMenuItems.forEach(menuItem => {
            this.getLayerContainer().getLayerById('main').addGraphics(menuItem.draw(position));
            position.y += menuItem.size.y;
            position.y += 30;
        });
    }
}