import { SpriteObject } from "../../model/SpriteObject";
import { Point } from "pixi.js";

export interface PlayerConfig {
    jumpSpeed: number;
    jumpMax: number;
}

export class PlayerSprite extends SpriteObject {
    state: Set<'jumping' | 'moving'> = new Set();

    currentJumpY = 0;
    currentJumpSpeed = 0;
    layer = 'game-layer-3';

    config: PlayerConfig = {
        jumpSpeed: 8,
        jumpMax: 250
    }

    jump() {
        if (!this.state.has('jumping')) {
            this.state.add('jumping')
            this.currentJumpSpeed = this.config.jumpSpeed
        }
    }

    update() {
        if (this.state.has('jumping')) {
            this.updateJump()
        }
    }

    updateJump() {
        let delta = 0;
        if (this.currentJumpSpeed > 0) {
            if (this.currentJumpY + this.currentJumpSpeed >= this.config.jumpMax) {
                delta = this.config.jumpMax - this.currentJumpY;
                this.currentJumpSpeed = - this.config.jumpSpeed;
                this.currentJumpY += delta;
            } else {
                delta = this.currentJumpSpeed;
                this.currentJumpY += delta;
            }
        } else {
            if (this.currentJumpY + this.currentJumpSpeed <= 0) {
                delta = -this.currentJumpY;
                this.currentJumpSpeed = 0;
                this.currentJumpY += delta;
                this.state.delete('jumping');
            } else {
                delta = this.currentJumpSpeed;
                this.currentJumpY += delta;
            }
        }

        this.sprite.y -= delta;
    }
}