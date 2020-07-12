import { AbstractStore } from "./AbstractStore";
import { GameObject } from "../model/GameObject";
import { Player } from "../model/Player";


export class GameObjectStore extends AbstractStore {
    gameObjects: GameObject[] = [];
    player: Player;

    obstacles: GameObject[] = [];
    balloons: GameObject[] = [];

}