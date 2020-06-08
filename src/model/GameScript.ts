import { Registry } from "../Registry";


export abstract class GameScript {
    childScripts: GameScript[] = [];
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.registry.gameScripts.push(this);
    }

    awake() {

    }

    update(delta: number) {

    }
}