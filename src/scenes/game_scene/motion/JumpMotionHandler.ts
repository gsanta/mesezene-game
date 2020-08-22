import { IMotionHandler } from "./IMotionHandler";
import { SpriteObject } from "../../../model/SpriteObject";

export class JumpMotionHandler implements IMotionHandler {
    gameObject: SpriteObject;
    private state: Set<'jumping' | 'moving'> = new Set();

    currentJumpY = 0;
    private currentJumpSpeed = 0;

    private readonly jumpSpeed =  8;
    private readonly jumpMax = 250;

    execute() {
        if (!this.state.has('jumping')) {
            this.state.add('jumping')
            this.currentJumpSpeed = this.jumpSpeed
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
            if (this.currentJumpY + this.currentJumpSpeed >= this.jumpMax) {
                delta = this.jumpMax - this.currentJumpY;
                this.currentJumpSpeed = - this.jumpSpeed;
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

        this.gameObject.container.y -= delta;
    }
}