import { CollisionRect, willCollideH, willCollideY, willCollideDiag } from "./collisions";
import { Registry } from "../Registry";
  
  export interface Collision {
    v: number;
    h: number;
  }
  
  export interface CharacterCollisions {
    platform: Collision;
  }
  
  export const CharacterCollisionRect = {
    Width: 30,
    Height: 50
  };
  
  export const createCenteredCollisionBox = (box: CollisionRect) => {
    return {
      x: box.x - box.width / 2,
      y: box.y - box.height / 2,
      width: box.width,
      height: box.height
    };
  };
  

export class CharacterCollider {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    calculateCollision(): Collision {
        const player = this.registry.services.scene.player;
        const platforms = this.registry.services.scene.platforms;

        const playerCollisionBox = player.getDimensions();

        let collision: Collision;

        platforms.find(platform => {
            const platformCollisionBox = platform.getDimensions();

            collision = this.getObjectCollision(playerCollisionBox, platformCollisionBox, 1, 1);
            return collision; 
        });

        return collision;
    }

    private getObjectCollision(box1: CollisionRect, box2: CollisionRect, predictedVx: number, predictedVy: number): Collision {
        const horizontal = willCollideH(box1, box2, predictedVx);
        const vertical = willCollideY(box1, box2, predictedVy);
        const diag = willCollideDiag(box1, box2, predictedVx, predictedVy);
    
        let collision: Collision = undefined;
      
        if (horizontal || vertical) {
            collision = {
                h: horizontal ? horizontal : 0,
                v: vertical ? vertical : 0
            };
        } else {
            collision = {
                h: diag ? diag.h : 0,
                v: 0
            }
        }

        return collision;
    }
}
  