import { AbstractScene, StateDescription } from "../AbstractScene";
import { Application, Graphics, Point, TextStyle, Text } from "pixi.js";
import { Registry } from "../../Registry";
import { LayerContainer, Layer } from "../../stores/LayerContainer";
import { AppJson, SceneLoader } from "../SceneLoader";
import { MapSceneId } from "../map_scene/MapScene";
import { MenuItemGraphics } from "./MenuItemGraphics";
import { MenuSceneState, MenuSceneId } from "./MenuSceneState";
import { GameSceneId, GameSceneState } from "../game_scene/GameSceneState";
import { SpriteStore } from "../../stores/SpriteStore";

export enum MenuItemId {
    GameResume = 'GameResume',
    GameExit = 'GameExit',
    GameStart = 'GameStart',
    GameRestart = 'GameRestart',
    WorldMap = 'WorldMap'
}

const menuStates: StateDescription<MenuSceneState>[] = [
    new StateDescription(MenuSceneId, MenuSceneState.WorldMapState)
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
        }),
    new StateDescription(MenuSceneId, MenuSceneState.GameOverState)
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
                menuScene.menuItems.get(MenuItemId.GameRestart),
                menuScene.menuItems.get(MenuItemId.WorldMap),
            ];
            
            menuScene.activeMenuItems.forEach(menuItem => {
                menuScene.getLayerContainer().getLayerById('main').addGraphics(menuItem.draw(position));
                position.y += menuItem.size.y;
                position.y += 30;
            });
        }),
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

export class MenuScene extends AbstractScene {
    id = MenuSceneId;
    isOverlay = true;
    private application: Application;
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
                    this.registry.services.scene.getSceneById(GameSceneId).activeStateId = GameSceneState.Running;
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
                    this.registry.services.scene.getSceneById(GameSceneId).activeStateId = GameSceneState.Running;
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

        this.states.registerStates(menuStates);
    }

    doDestroy() {}
    doUpdate() {
        
    }

    doDraw() {
        this.states.getSateById(this.activeStateId).draw(this, this.registry);

    }

    private drawBackground(): void {

    }
}