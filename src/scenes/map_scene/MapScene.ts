import { SceneActions } from "../../actions/SceneActions";
import { GameObjectRole } from "../../model/GameObject";
import { Registry } from "../../Registry";
import { IService, ServiceCapability } from "../../services/IService";
import { Layer } from "../../stores/LayerContainer";
import { SpriteStore } from "../../stores/SpriteStore";
import { AbstractScene } from "../AbstractScene";
import { GameSceneId } from "../game_scene/GameSceneState";
import { SceneLoader } from "../SceneLoader";
import { ArrowGraphics } from "./ArrowGraphics";
import { BadgeGraphics } from "./BadgeGraphics";
import { mapSceneJson } from "./mapSceneJson";

export const MapSceneId = 'map_scene';
export class MapScene extends AbstractScene implements IService {
    id = MapSceneId;
    capabilities = [ServiceCapability.Listen];

    constructor(registry: Registry) {
        super(registry, mapSceneJson);
        this.registry = registry;

        this.loader = new SceneLoader(this, this.registry);

        this.spriteStore = new SpriteStore(this.registry);
    }

    activate() {
        super.activate();
        this.registry.services.scene.menuScene.setMenu(this.registry.services.scene.menuScene.menus.worldMap);
    }

    init() {
        const application = this.registry.services.scene.application;

        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('background-layer', application));
        this.registry.stores.layer.getContainer(this.id).addLayer(new Layer('foreground-layer', application));
        
        const background = this.spriteStore.getByRole(GameObjectRole.Background)[0];
        const backgroundLayer = this.registry.stores.layer.getContainer(this.id).getLayerById('background-layer');
        
        backgroundLayer.addChild(background);

        const badges: BadgeGraphics[] = [
            new BadgeGraphics(this, 'badge_gray', 'foreground-layer'),
            new BadgeGraphics(this, 'badge_green', 'foreground-layer'),
            new BadgeGraphics(this, 'badge_yellow', 'foreground-layer'),
            new BadgeGraphics(this, 'badge_red', 'foreground-layer'),
            new BadgeGraphics(this, 'badge_orange', 'foreground-layer'),
        ];

        badges[0].isDisabled = false;
        badges[0].onClick(() => this.registry.services.scene.activateScene(GameSceneId));

        const routes: ArrowGraphics[] = []

        for (let i = 0; i < badges.length - 1; i++) {
            routes[i] = new ArrowGraphics(this, badges[i], badges[i + 1], 'foreground-layer', { lineColorHex: '#ff0000', dashWidth: 30, strokeWidth: 3});
        }

        routes.forEach(route => route.draw());
        badges.forEach(badge => badge.draw());
    }

    update() {}
}