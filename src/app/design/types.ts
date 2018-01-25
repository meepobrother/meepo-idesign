import { Type, Injector, NgModuleFactory } from '@angular/core';
export interface DesignComponentProp<T>{
    component: Type<T>;
    injector?: Injector;
    content?: any[][];
    module?: NgModuleFactory<any>;
}

export interface DesignLibraryProp {
    preview?: DesignComponentProp<any>;
    setting?: DesignComponentProp<any>;
    name?: string;
    uuid?: string;
}

export interface DesignHistoryProp{
    name: string;
    data: DesignLibraryProp[];
}