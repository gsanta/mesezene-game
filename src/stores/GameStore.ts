import { AbstractStore } from "./AbstractStore";
import { GameObject } from "../model/GameObject";
import { Player } from "../model/Player";


export class GameStore extends AbstractStore {
    sprites: GameObject[] = [];
    player: Player;

    platforms: GameObject[] = [];
    balloons: GameObject[] = [];

}