import { AbstractStore } from "./AbstractStore";
import { GameObject } from "../model/GameObject";

export class TemplateStore extends AbstractStore { 
    platformRegistry: GameObject[] = [];
    balloonRegistry: GameObject[] = [];


    addTemplate(gameObject: GameObject) {
        1;

        if (gameObject.id.startsWith('platform')) {
            // this.platformRegistry.push(gameObject);    
        } else if (gameObject.id.startsWith('balloon')) {
            // this.balloonRegistry.push(gameObject);    
        } else if (gameObject.id.startsWith('player')) {
            // this.registry.stores.game.player = new Player(new Sprite(sheet.textures[spriteJson.frameName]));
            // gameObject = this.registry.stores.game.player;
            // gameObject.fromJson(spriteJson);
            // this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
        }
        // gameObject.fra
        // if (spriteJson.frameName.startsWith('platform')) {
        //     gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
        //     gameObject.fromJson(spriteJson);
        //     this.registry.stores.template.platformRegistry.push(gameObject);    
        // } else if (spriteJson.frameName.startsWith('balloon')) {
        //     gameObject = new GameObject(new Sprite(sheet.textures[spriteJson.frameName]));
        //     gameObject.fromJson(spriteJson);
        //     this.registry.stores.template.balloonRegistry.push(gameObject);    
        // } else if (spriteJson.frameName.startsWith('player')) {
        //     this.registry.stores.game.player = new Player(new Sprite(sheet.textures[spriteJson.frameName]));
        //     gameObject = this.registry.stores.game.player;
        //     gameObject.fromJson(spriteJson);
        //     this.registry.services.scene.layerContainers[gameObject.verticalLayer].addChild(gameObject.sprite);
        // }
    }
}