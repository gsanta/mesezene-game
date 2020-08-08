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
        .onDraw((worldMapScene, registry) => {
            const background = worldMapScene.spriteStore.getByRole(GameObjectRole.Background)[0];

            const backgroundLayer = registry.stores.layer.getContainer(worldMapScene.id).getLayerById('background-layer');
            
            backgroundLayer.addChild(background);

            const foregroundLayer = registry.stores.layer.getContainer(worldMapScene.id).getLayerById('foreground-layer');
            const badgeGray = worldMapScene.spriteStore.getByName('badge_gray')[0];
            const badgeGreen = worldMapScene.spriteStore.getByName('badge_green')[0];
            const badgeYellow = worldMapScene.spriteStore.getByName('badge_yellow')[0];
            const badgeRed = worldMapScene.spriteStore.getByName('badge_red')[0];
            const badgeOrange = worldMapScene.spriteStore.getByName('badge_orange')[0];

            let arrow = new ArrowGraphics(
                new LineCalcs().shorten(new Line(new Point(...badgeGray.getDimensions().center()), new Point(...badgeGreen.getDimensions().center()))),
                { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3}
            );

            foregroundLayer.addGraphics(arrow.draw());

            arrow = new ArrowGraphics(
                new LineCalcs().shorten(new Line(new Point(...badgeGreen.getDimensions().center()), new Point(...badgeYellow.getDimensions().center()))),
                { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3}
            );

            foregroundLayer.addGraphics(arrow.draw());

            arrow = new ArrowGraphics(
                new LineCalcs().shorten(new Line(new Point(...badgeYellow.getDimensions().center()), new Point(...badgeRed.getDimensions().center()))),
                { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3}
            );

            foregroundLayer.addGraphics(arrow.draw());

            arrow = new ArrowGraphics(
                new LineCalcs().shorten(new Line(new Point(...badgeRed.getDimensions().center()), new Point(...badgeOrange.getDimensions().center()))),
                { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3}
            );

            foregroundLayer.addGraphics(arrow.draw());

            foregroundLayer.addChild(badgeGray);
            foregroundLayer.addChild(badgeGreen);
            foregroundLayer.addChild(badgeYellow);
            foregroundLayer.addChild(badgeRed);
            foregroundLayer.addChild(badgeOrange);

            const badgeGrayGraphics = new BadgeGraphics(badgeGray, badgeGray.id, worldMapScene.textureStore);


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