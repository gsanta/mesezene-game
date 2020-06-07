import { Application } from "pixi.js";

export class PixieApp {
    pixieApp: Application; 

    constructor() {
        this.pixieApp = new Application({width: 256, height: 256});
        document.getElementById('app').appendChild(this.pixieApp.view);

    }
}