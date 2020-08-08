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

            let p1 = new Point(...badgeGray.getDimensions().center());
            let p2 = new Point(...badgeGreen.getDimensions().center());
            let pControl = new Point(badgeGreen.getDimensions().center()[0] + 100, badgeGreen.getDimensions().center()[1] - 100);
            let line: [Point, Point] = [p1, p2];
            line = new LineCalcs().shorten(line, 3);
            // const [p1x, p1y] = badgeGray.getDimensions().center();
            // const [p2x, p2y] = [badgeGreen.getDimensions().center()[0] + 100, badgeGreen.getDimensions().center()[1] - 100] 
            // const [p3x, p3y] = badgeGreen.getDimensions().center();

            let arrow = new ArrowGraphics(new BezierCurve([line[0], pControl, line[1]], 100));

            foregroundLayer.addGraphics(arrow.draw());

            p1 = new Point(...badgeGreen.getDimensions().center());
            p2 = new Point(...badgeYellow.getDimensions().center());
            pControl = new Point(badgeYellow.getDimensions().center()[0] - 100, badgeYellow.getDimensions().center()[1] + 100);
            line = [p1, p2];
            line = new LineCalcs().shorten(line, 3);
            // const [p1x, p1y] = badgeGray.getDimensions().center();
            // const [p2x, p2y] = [badgeGreen.getDimensions().center()[0] + 100, badgeGreen.getDimensions().center()[1] - 100] 
            // const [p3x, p3y] = badgeGreen.getDimensions().center();

            arrow = new ArrowGraphics(new BezierCurve([line[0], pControl, line[1]], 100));
            foregroundLayer.addGraphics(arrow.draw());

            p1 = new Point(...badgeYellow.getDimensions().center());
            p2 = new Point(...badgeRed.getDimensions().center());
            pControl = new Point(badgeRed.getDimensions().center()[0], badgeRed.getDimensions().center()[1] - 100);
            line = [p1, p2];
            line = new LineCalcs().shorten(line, 3);
            // const [p1x, p1y] = badgeGray.getDimensions().center();
            // const [p2x, p2y] = [badgeGreen.getDimensions().center()[0] + 100, badgeGreen.getDimensions().center()[1] - 100] 
            // const [p3x, p3y] = badgeGreen.getDimensions().center();

            arrow = new ArrowGraphics(new BezierCurve([line[0], pControl, line[1]], 100));

            foregroundLayer.addGraphics(arrow.draw());

            p1 = new Point(...badgeRed.getDimensions().center());
            p2 = new Point(...badgeOrange.getDimensions().center());
            pControl = new Point(badgeOrange.getDimensions().center()[0] - 100, badgeOrange.getDimensions().center()[1] - 100);
            line = [p1, p2];
            line = new LineCalcs().shorten(line, 3);
            // const [p1x, p1y] = badgeGray.getDimensions().center();
            // const [p2x, p2y] = [badgeGreen.getDimensions().center()[0] - 100, badgeGreen.getDimensions().center()[1] - 100] 
            // const [p3x, p3y] = badgeGreen.getDimensions().center();

            arrow = new ArrowGraphics(new BezierCurve([line[0], pControl, line[1]], 100));
            foregroundLayer.addGraphics(arrow.draw());


            foregroundLayer.addChild(badgeGray);
            foregroundLayer.addChild(badgeGreen);
            foregroundLayer.addChild(badgeYellow);
            foregroundLayer.addChild(badgeRed);
            foregroundLayer.addChild(badgeOrange);

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