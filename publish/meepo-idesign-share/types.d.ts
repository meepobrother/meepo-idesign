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
export declare const DESIGN_COMPONENTS: InjectionToken<{}>;
export declare class DesignPropsService {
    props: any[];
    pageProps: any[];
    settingProps: any;
    historyKey: string;
    historys: any[];
    constructor(props: any);
    getPropsByName(name: string): DesignLibraryProp;
    addPropByName(name: string): void;
    removePropsByUid(uuid: string): void;
    getHistory(): DesignHistoryProp[];
    updateHistory(): void;
    backToHistory(item?: DesignHistoryProp): void;
}
export declare class DesignLibraryService {
    private components;
    constructor(components: any);
    get(name: string): any;
}
