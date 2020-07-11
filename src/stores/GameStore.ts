import { AbstractStore } from "./AbstractStore";
import { GameObject } from "../model/GameObject";
import { Player } from "../model/Player";


export class GameStore extends AbstractStore {
    gameObjects: GameObject[] = [];
    player: Player;

    obstacles: GameObject[] = [];
    balloons: GameObject[] = [];

}