import { SceneState } from "../../AbstractScene";
import { MapSceneId, MapScene } from "../MapScene";
import { Layer } from "../../../stores/LayerContainer";
import { GameObjectRole } from "../../../model/SpriteObject";
import { BadgeGraphics } from "../BadgeGraphics";
import { GameSceneState } from "../../game_scene/GameSceneState";
import { ArrowGraphics } from "../ArrowGraphics";
import { SceneActions } from "../../../actions/SceneActions";
import { WorldMapState } from "./WorldMapState";

export const worldmapDefaultState = new SceneState<WorldMapState>(MapSceneId, WorldMapState.DefaultState)
    .onDraw((worldMapScene: MapScene, registry) => {
        registry.services.event.addListener(worldMapScene);

        const application = registry.services.scene.application;

        registry.stores.layer.getContainer(worldMapScene.id).addLayer(new Layer('background-layer', [0, 1], application));
        registry.stores.layer.getContainer(worldMapScene.id).addLayer(new Layer('foreground-layer', [0, 1], application));
        
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
        badges[0].onClick(() => registry.services.scene.gameScene.activate(GameSceneState.Running));

        const routes: ArrowGraphics[] = []

        for (let i = 0; i < badges.length - 1; i++) {
            routes[i] = new ArrowGraphics(worldMapScene, badges[i], badges[i + 1], 'foreground-layer', { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3});
        }

        routes.forEach(route => route.draw());
        badges.forEach(badge => badge.draw());

        registry.services.event.dispatch(SceneActions.SCENE_START);
    });
