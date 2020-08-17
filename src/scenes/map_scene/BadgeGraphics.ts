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

        spriteObj.container.interactive = true;

        spriteObj.container.on('mouseover', () => {
            if (!this.isDisabled) {
                spriteObj.container.scale.set(0.6)
                spriteObj.setTexture(this.scene.textureStore.getByName(`${this.spriteId}_highlighted`));
            }
        });
    
        spriteObj.container.on('mouseout', () => {
            if (!this.isDisabled) {
                spriteObj.container.scale.set(0.5)
                spriteObj.setTexture(this.scene.textureStore.getByName(`${this.spriteId}`));
            }
        });
    
        spriteObj.container.on('click', () => {
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