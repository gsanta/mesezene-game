import { AbstractStore } from "./AbstractStore";
import { Container } from "pixi.js";


export class LayerStore extends AbstractStore {
    backgroundContainer: Container;
    layerContainers: Container[];

}