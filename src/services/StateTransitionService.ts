import { SceneStateLegacy } from "../scenes/AbstractScene";
import { Registry } from "../Registry";
import { GameSceneId } from "../scenes/game_scene/GameScene";


export interface StateDescription {
    menu: {
        menuItems: string[];
        visible: boolean;
    }
}

export class SceneStates<T> {
    private sceneStatesMap: Map<T, StateDescription> = new Map();

    registerState(sceneState: T, description: StateDescription) {
        this.sceneStatesMap.set(sceneState, description);
    }

    executeState(sceneState: T) {
        this.sceneStatesMap.get(sceneState)
    }
}

export class StateTransitionService {
    private sceneStatesMap: Map<string, string> = new Map();

    private prevState: SceneStateLegacy;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(description: StateDescription) {

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