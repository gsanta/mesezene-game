import { SceneStateLegacy } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { GameSceneId } from "../scenes/game_scene/GameSceneState";



export class StateTransitionService {
    private sceneStatesMap: Map<string, string> = new Map();

    private prevState: SceneStateLegacy;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    registerSceneStates<T>(sceneId: string) {

    }

    update() {
        if (!this.registry.services.scene.getActiveScene(false)) { return; }

        const currentState = this.registry.services.scene.getActiveScene(false).getState();
        this.handleTransition(this.prevState, currentState);

        this.prevState = currentState;
    }

    private handleTransition(prevState: SceneStateLegacy, currState: SceneStateLegacy) {
        const activeScene = this.registry.services.scene.getActiveScene(false);

        switch(activeScene.id) {
            case GameSceneId:
                if (prevState === SceneStateLegacy.Loading && currState === SceneStateLegacy.Ready) {
                    activeScene.run();
                    this.registry.services.scene.getActiveScene(true).hide();
                }
        }
    }
}