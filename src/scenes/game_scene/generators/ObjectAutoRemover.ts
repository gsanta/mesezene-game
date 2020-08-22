import { Registry } from "../../../Registry";
import { GameScene } from "../GameScene";
import { GameObjectRole, GameObject } from "../../../model/GameObject";


export class ObjectAutoRemover {
    private registry: Registry;
    private scene: GameScene;
    private types: GameObjectRole[];

    constructor(scene: GameScene, registry: Registry, types: GameObjectRole[]) {
        this.scene = scene;
        this.registry = registry;
        this.types = types;
    }

    tick() {
        const invalidObjects: GameObject[] = [];
    
        this.types.forEach(type => {
            this.scene.spriteStore.getByRole(type).forEach(object => {
                if (object.getDimensions().right() < 0) {
                    invalidObjects.push(object);
                }
            });
        })
    
        invalidObjects.forEach(removable => {
            this.scene.spriteStore.remove(removable);
            this.scene.laneManager.lanes[removable.layer].removeChild(removable);
        });
    
        this.registry.services.scene.application.stage.removeChild(...invalidObjects.map(balloon => balloon.container));
    }
}