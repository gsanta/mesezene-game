import { GameScript } from "../model/GameScript";
import { Registry } from "../Registry";
import { Point, Rectangle } from "pixi.js";
import { GameObject } from "../model/GameObject";

export enum GamepadKey {
    Left = 'Left',
    Up = 'Up',
    Right = 'Right',
    Down = 'Down'
}


export class GamepadService extends GameScript {
    private downKeys: Set<GamepadKey> = new Set();
    private borders: Rectangle;


    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }

    left(release: boolean) {
        const player = this.registry.services.scene.player;
        if (!release) {
            this.downKeys.add(GamepadKey.Left);
            player.speed.x = 2;
        } else {
            this.downKeys.delete(GamepadKey.Left);

            if (this.downKeys.has(GamepadKey.Right) === false && player.speed.y === 0) {
                player.speed.x = 0;
            }
        }
    }

    up(release: boolean) {
        const player = this.registry.services.scene.player;
        if (!release) {
            this.downKeys.add(GamepadKey.Up);
            player.speed.y = -2;
        } else {
            this.downKeys.delete(GamepadKey.Up);

            if (this.downKeys.has(GamepadKey.Down) === false && player.speed.x === 0) {
                player.speed.y = 0;
            }
        }
    }

    right(release: boolean) {
        const player = this.registry.services.scene.player;
        if (!release) {
            this.downKeys.add(GamepadKey.Right);
            player.speed.x = -2;
        } else {
            this.downKeys.delete(GamepadKey.Right);

            if (this.downKeys.has(GamepadKey.Left) === false && player.speed.y === 0) {
                player.speed.x = 0;
            }
        }
    }

    down(release: boolean) {
        const player = this.registry.services.scene.player;
        if (!release) {
            this.downKeys.add(GamepadKey.Down);
            player.speed.y = 2;
        } else {
            this.downKeys.delete(GamepadKey.Down);

            if (this.downKeys.has(GamepadKey.Up) === false && player.speed.x === 0) {
                player.speed.y = 0;
            }
        }
    }
}