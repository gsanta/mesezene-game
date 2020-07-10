import { Registry } from "../Registry";


export abstract class AbstractStore {

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
}