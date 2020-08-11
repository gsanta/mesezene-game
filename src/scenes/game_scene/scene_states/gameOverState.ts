import { SceneState } from "../../AbstractScene";
import { GameSceneState, GameSceneId } from "../GameSceneState";
import { MenuSceneId, MenuSceneState } from "../../menu_scene/MenuSceneState";


export const gameOverState = new SceneState<GameSceneState>(GameSceneId, GameSceneState.GameOver)
    .setOverlay(MenuSceneId, MenuSceneState.GameOverState);

