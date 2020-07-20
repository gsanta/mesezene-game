import { LayerContainer, Layer } from "./LayerContainer";


export class LayerStore {
    private containers: Map<string, LayerContainer> = new Map();

    addContainer(container: LayerContainer) {
        this.containers.set(container.id, container);
    }

    getContainer(id: string): LayerContainer {
        return this.containers.get(id);
    }
}