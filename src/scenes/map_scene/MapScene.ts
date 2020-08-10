import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole } from "../../model/SpriteObject";
import { Registry } from "../../Registry";
import { IListener } from "../../services/EventService";
import { IService, ServiceCapability } from "../../services/IService";
import { SpriteStore } from "../../stores/SpriteStore";
import { Layer } from "../../stores/LayerContainer";
import { AbstractScene, StateDescription } from "../AbstractScene";
import { GameSpriteFactory } from "../game_scene/GameSpriteFactory";
import { AppJson, SceneLoader } from "../SceneLoader";
import { ArrowGraphics } from "./ArrowGraphics";
import { BezierCurve } from "../../utils/BezierCurve";
import { Point } from "pixi.js";
import { LineCalcs } from "../../utils/LineCalcs";
import { Line } from "../../model/primitives/Line";
import { BadgeGraphics } from "./BadgeGraphics";
import { GameSceneId } from "../game_scene/GameSceneState";

export const mapSceneJson: AppJson = {
    width: 700,
    height: 700,
    gameSpeed: 2,
    spriteSheet: 'assets/sprites/map/sprite-sheet-map.json',
    sprites: [
        {
            x: 0,
            y: 0,
            scale: 1,
            path: "assets/backgrounds/map.png",
            name: 'background-layer2',
            isBackgroundImage: true,
            speedX: 0,
            speedY: 0,
            viewportX: 0,
            viewportY: 0,
            roles: [GameObjectRole.Background]
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_gray',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 580,
            viewportY: 20,
            roles: []
        },        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_gray_highlighted',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 234,
            viewportY: 21,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_green',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 30,
            viewportY: 80,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_yellow',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 350,
            viewportY: 300,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_red',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 35,
            viewportY: 600,
            roles: []
        },
        {
            x: 0,
            y: 0,
            scale: 0.5,
            frameName: 'badge_orange',
            name: 'front-layer',
            isBackgroundImage: false,
            speedX: 0,
            speedY: 0,
            viewportX: 550,
            viewportY: 600,
            roles: []
        },
    ]
}

export enum WorldMapState {
    DefaultState = 'DefaultState',
}

export const MapSceneId = 'map_scene';


const worldMapStates: StateDescription<WorldMapState>[] = [
    new StateDescription<WorldMapState>(MapSceneId, WorldMapState.DefaultState)
        // .setOverlay(MenuSceneId, MenuSceneState.WorldMapState)
        .onDraw((worldMapScene: MapScene, registry) => {
            const background = worldMapScene.spriteStore.getByRole(GameObjectRole.Background)[0];
            const backgroundLayer = registry.stores.layer.getContainer(worldMapScene.id).getLayerById('background-layer');
            
            backgroundLayer.addChild(background);

            const badges: BadgeGraphics[] = [
                new BadgeGraphics(worldMapScene, 'badge_gray', 'foreground-layer'),
                new BadgeGraphics(worldMapScene, 'badge_green', 'foreground-layer'),
                new BadgeGraphics(worldMapScene, 'badge_yellow', 'foreground-layer'),
                new BadgeGraphics(worldMapScene, 'badge_red', 'foreground-layer'),
                new BadgeGraphics(worldMapScene, 'badge_orange', 'foreground-layer'),
            ];

            badges[0].isDisabled = false;
            badges[0].onClick(() => registry.services.scene.activateScene(GameSceneId));

            const routes: ArrowGraphics[] = []

            for (let i = 0; i < badges.length - 1; i++) {
                routes[i] = new ArrowGraphics(worldMapScene, badges[i], badges[i + 1], 'foreground-layer', { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3});
            }

            routes.forEach(route => route.draw());
            badges.forEach(badge => badge.draw());

            registry.services.event.dispatch(SceneActions.SCENE_START);
        })
]

export class MapScene extends AbstractScene<WorldMapState> implements IListener, IService {
    id = MapSceneId;
    capabilities = [ServiceCapability.Listen];

    constructor(registry: Registry) {
        super(registry, mapSceneJson);
        this.registry = registry;
        this.activeStateId = WorldMapState.DefaultState;
        
        this.states.registerStates(worldMapStates);

        this.loader = new SceneLoader(this, this.registry);
        this.factory = new GameSpriteFactory();

        this.spriteStore = new SpriteStore(this.registry);
    }

    listen(action: string) {}

    doDraw() {
        this.registry.services.event.addListener(this);

        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('background-layer', [0, 1], application));
        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('foreground-layer', [0, 1], application));

        this.states.getSateById(this.activeStateId).draw(this, this.registry);
    }

    doDestroy() {

    }

    doUpdate() {

    }
}