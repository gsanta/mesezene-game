import { MapScene } from "./MapScene";

export class BadgeGraphics {
    private scene: MapScene;
    private textureName: string;
    spriteId: string;
    private layerId: string;

    private onClickFunc: () => void;

    isDisabled: boolean = true;

    constructor(scene: MapScene, spriteId: string, layerId: string) {
        this.scene = scene;
        this.spriteId = spriteId;
        this.layerId = layerId;
    }
    
    draw() {
        const spriteObj = this.scene.spriteStore.getByName(this.spriteId)[0];

        spriteObj.sprite.interactive = true;

        spriteObj.sprite.on('mouseover', () => {
            if (!this.isDisabled) {
                spriteObj.sprite.scale.set(0.6)
                spriteObj.sprite.texture = this.scene.textureStore.getByName(`${this.spriteId}_highlighted`);
            }
        });
    
        spriteObj.sprite.on('mouseout', () => {
            if (!this.isDisabled) {
                spriteObj.sprite.scale.set(0.5)
                spriteObj.sprite.texture = this.scene.textureStore.getByName(`${this.spriteId}`);
            }
        });
    
        spriteObj.sprite.on('click', () => {
            if (!this.isDisabled) {
                this.onClickFunc && this.onClickFunc();
            }
        });

        this.scene.getLayerContainer().getLayerById(this.layerId).addChild(spriteObj);
    }

    onClick(onClickFunc: () => void) {
        this.onClickFunc = onClickFunc;
    }
}