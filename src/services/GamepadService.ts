import { Rectangle } from "pixi.js";
import { GameScript } from "../model/GameScript";
import { Registry } from "../Registry";
import { GameObjectRole } from "../model/GameObject";
import { GameSceneId } from "../scenes/game_scene/GameSceneState";

export enum GamepadKey {
    Left = 'Left',
    Up = 'Up',
    Right = 'Right',
    Down = 'Down',
    Jump = 'Jump'
}


export class GamepadService extends GameScript {
    downKeys: Set<GamepadKey> = new Set();
    private borders: Rectangle;


    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }

    jump(release: boolean) {
        if (!release) {
            this.downKeys.add(GamepadKey.Jump);
        } else {
            this.downKeys.delete(GamepadKey.Jump);
        }
    }

    left(release: boolean) {
        if (!this.registry.services.scene.isActiveScene(GameSceneId)) { return }

        const player = this.registry.services.scene.getSceneById(GameSceneId).spriteStore.getByRole(GameObjectRole.Player)[0];
        if (!release) {
            this.downKeys.add(GamepadKey.Left);
            player.speed.x = -2;
        } else {
            this.downKeys.delete(GamepadKey.Left);

            if (this.downKeys.has(GamepadKey.Right) === false) {
                player.speed.x = 0;
            }
        }
    }

    up(release: boolean) {
        if (!this.registry.services.scene.isActiveScene(GameSceneId)) { return }

        const player = this.registry.services.scene.getSceneById(GameSceneId).spriteStore.getByRole(GameObjectRole.Player)[0];
        if (!release) {
            this.downKeys.add(GamepadKey.Up);
            player.speed.y = -2;
        } else {
            this.downKeys.delete(GamepadKey.Up);

            if (this.downKeys.has(GamepadKey.Down) === false) {
                player.speed.y = 0;
            }
        }
    }

    right(release: boolean) {
        if (!this.registry.services.scene.isActiveScene(GameSceneId)) { return }

        const player = this.registry.services.scene.getSceneById(GameSceneId).spriteStore.getByRole(GameObjectRole.Player)[0];
        if (!release) {
            this.downKeys.add(GamepadKey.Right);
            player.speed.x = 2;
        } else {
            this.downKeys.delete(GamepadKey.Right);

            if (this.downKeys.has(GamepadKey.Left) === false) {
                player.speed.x = 0;
            }
        }
    }

    down(release: boolean) {
        if (!this.registry.services.scene.isActiveScene(GameSceneId)) { return }

        const player = this.registry.services.scene.getSceneById(GameSceneId).spriteStore.getByRole(GameObjectRole.Player)[0];
        if (!release) {
            this.downKeys.add(GamepadKey.Down);
            player.speed.y = 2;
        } else {
            this.downKeys.delete(GamepadKey.Down);

            if (this.downKeys.has(GamepadKey.Up) === false) {
                player.speed.y = 0;
            }
        }
    }
}