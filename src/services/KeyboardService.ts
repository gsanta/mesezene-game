import { GameScript } from "../model/GameScript";
import { Registry } from "../Registry";

export enum Keyboard {
    Enter = 13,
    w = 87,
    a = 65,
    d = 68,
    s = 83,
    e = 69,
    p = 80,
    Space = 32,
    ArrowLeft = 37,
    ArrowRight = 39,
    ArrowDown = 40,
    ArrowUp = 38
}

export class KeyboardService {
    serviceName = 'keyboard-service'

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    
    onKeyDown(e: KeyboardEvent): void {
        switch(e.keyCode) {
            case Keyboard.ArrowLeft:
                this.registry.services.gamepad.left(false);
            break;
            case Keyboard.ArrowRight:
                this.registry.services.gamepad.right(false);
            break;
            case Keyboard.ArrowUp:
                this.registry.services.gamepad.up(false);
            break;
            case Keyboard.ArrowDown:
                this.registry.services.gamepad.down(false);
            break;
            case Keyboard.Space:
                this.registry.services.gamepad.jump(false);
            break;
        }

        e.preventDefault();
        e.stopPropagation();
    }

    onKeyUp(e: KeyboardEvent): void {
        switch(e.keyCode) {
            case Keyboard.ArrowLeft:
                this.registry.services.gamepad.left(true);
            break;
            case Keyboard.ArrowRight:
                this.registry.services.gamepad.right(true);
            break;
            case Keyboard.ArrowUp:
                this.registry.services.gamepad.up(true);
            break;
            case Keyboard.ArrowDown:
                this.registry.services.gamepad.down(true);
            break;
            case Keyboard.Space:
                this.registry.services.gamepad.jump(true);
            break;
        }

        e.preventDefault();
        e.stopPropagation();
    }
}