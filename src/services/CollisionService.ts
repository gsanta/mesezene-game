import { GameScript } from "../model/GameScript";
import { Sprite } from "pixi.js";
import { Registry } from "../Registry";



export class CollisionService extends GameScript {

    constructor(registry: Registry) {
        super(registry);
    }

    update() {
    
        this.registry.services.scene.platforms.forEach(platform => {
            if (this.hitTestRectangle(this.registry.services.scene.player.sprite, platform.sprite)) {
            } else {
            }
        });
    }
    
    private hitTestRectangle(r1: Sprite, r2: Sprite) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
      
        //hit will determine whether there's a collision
        hit = false;
        
      
        //Find the center points of each sprite
        let r1CenterX = r1.x + r1.width / 2;
        let r1CenterY = r1.y + r1.height / 2;
        let r2CenterX = r2.x + r2.width / 2;
        let r2CenterY = r2.y + r2.height / 2;
      
        //Find the half-widths and half-heights of each sprite
        let r1HalfWidth = r1.width / 2;
        let r1HalfHeight = r1.height / 2;
        let r2HalfWidth = r2.width / 2;
        let r2HalfHeight = r2.height / 2;
      
        //Calculate the distance vector between the sprites
        vx = r1CenterX - r2CenterX;
        vy = r1CenterY - r2CenterY;
      
        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1HalfWidth + r2HalfWidth;
        combinedHalfHeights = r1HalfHeight + r2HalfHeight;
      
        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
      
          //A collision might be occurring. Check for a collision on the y axis
          if (Math.abs(vy) < combinedHalfHeights) {
      
            //There's definitely a collision happening
            hit = true;
          } else {
      
            //There's no collision on the y axis
            hit = false;
          }
        } else {
      
          //There's no collision on the x axis
          hit = false;
        }
      
        //`hit` will be either `true` or `false`
        return hit;
      }
}