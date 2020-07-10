import { Registry } from "../Registry";

export interface IListener {
    listen(action: string): void;
}

export class EventService {
    private registry: Registry;
    private listeners: IListener[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addListener(listener: IListener) {
        this.listeners.push(listener);
    }

    removeListener(listener: IListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    dispatch(action: string) {
        this.listeners.forEach(listener => listener.listen(action));
    }
}