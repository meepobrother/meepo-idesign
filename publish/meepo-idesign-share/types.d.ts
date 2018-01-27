export interface DesignLibraryProp {
    children: DesignLibraryProp[];
    name: string;
    uuid?: string;
    props: any;
    state?: any;
    title: string;
}
export interface DesignHistoryProp {
    name: string;
    data: DesignLibraryProp[];
}
import { InjectionToken } from '@angular/core';
export declare const DESIGN_LIBRARYS: InjectionToken<{}>;
export declare class DesignApiService {
    constructor();
    get(id: string): void;
    save(data: any, id: string): void;
}
export declare class DesignLibraryService {
    private components;
    constructor(components: any);
    get(name: string): any;
}
