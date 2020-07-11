import { AbstractStore } from "./AbstractStore";
import { GameObject } from "../model/GameObject";

export class TemplateStore extends AbstractStore { 
    platformRegistry: GameObject[] = [];
    balloonRegistry: GameObject[] = [];


    addTemplate(gameObject: GameObject) {

    }
}