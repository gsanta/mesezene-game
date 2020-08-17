import { GameWindow } from "./GameWindow";
import { GameScript } from "./model/GameScript";
import { Services } from "./Services";
import { Stores } from "./Stores";
import { IListener } from "./services/EventService";
import { ServiceCapability, IService } from "./services/IService";

export const gameConfig = {
    width: 700,
    height: 700
}

export class Registry {
    private controlledObjects: IService[] = [];
    gameScripts: GameScript[] = [];
    gameWindow: GameWindow;
    services: Services;
    stores: Stores;

    constructor() {
        this.gameWindow = new GameWindow(this);
        this.stores = new Stores(this);
        this.services = new Services(this);

        this.setupControlledObjects();
    }

    registerControlledObject(controlledObject: IService) {
        this.controlledObjects.push(controlledObject);
    }

    private setupControlledObjects() {
        this.controlledObjects.forEach(service => {
            if (ServiceCapability.hasCapability(service, ServiceCapability.Listen)) {
                this.services.event.addListener(<IListener> <unknown> service);
            }
        });
    }
}