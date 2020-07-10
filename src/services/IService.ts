

export enum ServiceCapability {
    Listen = 'Listen'
}

export namespace ServiceCapability {
    export function hasCapability(service: IService, capability: ServiceCapability) {
        return service.capabilities.indexOf(capability) !== -1;
    }
}

export interface IService {
    capabilities: ServiceCapability[]; 
}