import { SceneState } from "../../AbstractScene";
import { GameSceneState, GameSceneId } from "../GameSceneState";
import { MenuSceneId, MenuSceneState } from "../../menu_scene/MenuSceneState";
import { GameScene } from "../GameScene";
import { Registry } from "../../../Registry";
import { Layer } from "../../../stores/LayerContainer";
import { defaultAppJson } from "../../SceneLoader";
import { PlayerSprite } from "../PlayerSprite";
import { GameObjectRole } from "../../../model/SpriteObject";
import { SceneActions } from "../../../actions/SceneActions";
import { Point } from "pixi.js";
import { GamepadKey } from "../../../services/GamepadService";

export const gameRunningState = new SceneState<GameSceneState>(GameSceneId, GameSceneState.Running)
    .setOverlay(MenuSceneId, MenuSceneState.GameRunningMenuState, false)
    .onDraw((scene: GameScene, registry: Registry) => {
        scene.reset();
        const application = registry.services.scene.application;
    
        const gameContainer = registry.stores.layer.getContainer(scene.id);
    
        gameContainer.addLayer(new Layer('background-layer', [0, 0.73], application));
        gameContainer.addLayer(new Layer(`game-layer-1`, [0.73, 0.78], application))
        gameContainer.addLayer(new Layer(`game-layer-2`, [0.78, 0.83], application))
        gameContainer.addLayer(new Layer(`game-layer-3`, [0.83, 0.88], application))
        gameContainer.addLayer(new Layer(`game-layer-4`, [0.88, 0.93], application))
        gameContainer.addLayer(new Layer('menu-layer', [0, 1], application));
    
        const appJson = defaultAppJson;
        this.gameSpeed = appJson.gameSpeed;
    
        const player = <PlayerSprite> scene.spriteStore.getByRole(GameObjectRole.Player)[0];
        scene.playerMoveHandler.setPlayer(player);

        gameContainer.getLayerById('game-layer-3').addChild(player);

        const backgroundSprites = scene.spriteStore.getByRole(GameObjectRole.Background);
        backgroundSprites.forEach(sprite => gameContainer.getLayerById('background-layer').addChild(sprite));

        scene.vertialBorders = [405, 510];
        scene.horizontalBorders = [0, registry.services.scene.sceneDimensions.x];

        scene.obstacleGenerator.update();
        scene.coinGenerator.update();

        registry.services.event.dispatch(SceneActions.SCENE_START);
    })
    .onUpdate((scene: GameScene, registry: Registry) => {
        const player = <PlayerSprite> scene.spriteStore.getByRole(GameObjectRole.Player)[0];

        const scrollableSprites = scene.spriteStore.getAll().filter(gameObject => !gameObject.roles.has(GameObjectRole.Player));
        const deltaMove = new Point(-scene.gameSpeed, 0);
        scrollableSprites.forEach(gameObject => gameObject.move(deltaMove));

        scene.playerMoveHandler.move();

        if (registry.services.gamepad.downKeys.has(GamepadKey.Jump)) {
            player.jump();
        }

        player.update();

        scene.obstacleGenerator.update();
        scene.coinGenerator.update();

        if (scene.obstacleCollider.checkCollisions()) {
            registry.services.scene.gameScene.activate(GameSceneState.GameOver);
        }
        scene.coinCollider.checkCollisions();

        registry.services.event.dispatch(SceneActions.SCENE_UPDATE);
    })
    .onDestroy((scene: GameScene, registry: Registry) => {
        registry.services.collision.stop();
    });