export interface DesignLibraryProp {
    children: DesignLibraryProp[];
    name: string;
    uuid?: string;
    props: any;
    state?: any;
    title: string;
    father?: string;
}
export interface DesignHistoryProp {
    name: string;
    data: DesignLibraryProp[];
}
import { InjectionToken } from '@angular/core';
import 'rxjs/add/operator/switchMap';
export declare const DESIGN_LIBRARYS: InjectionToken<{}>;
export declare const instancesMap: Map<string, {
    setting: any;
    view: any;
}>;
export declare class InstanceComponent {
    guid: string;
    props: DesignLibraryProp;
    instance: any;
    constructor(guid: string, props: DesignLibraryProp, instance: any);
}
export declare class DesignApiService {
    constructor();
    get(id: string): {
        setting: any;
        view: any;
    };
    save(instance: any, designLibraryProp: any, isPreview: any): void;
}
export declare const DESIGN_COMPONENTS: InjectionToken<{}>;
import 'rxjs/add/operator/map';
export declare class DesignPropsService {
    props: any[];
    pageProps: DesignLibraryProp[];
    _settingProps: DesignLibraryProp;
    settingProps: DesignLibraryProp;
    instance: any;
    fathers: any;
    fathersProps: DesignLibraryProp[];
    historyKey: string;
    historys: any[];
    removePosition: number[];
    constructor(props: any);
    getPropsByName(name: string): DesignLibraryProp;
    addPropByName(name: string, father?: string): void;
    addPropsToInstanceByName(name: string): void;
    toFatherProps(): void;
    deepCopy(obj: any): any;
    private isGuid(name);
    private trimGuid(name);
    removePropsByUid(uuid: string): void;
    getFather(props: DesignLibraryProp, ids?: any[]): any[];
    getPropsByUid(uuid: string, data?: DesignLibraryProp[]): DesignLibraryProp | false;
    getHistory(): DesignHistoryProp[];
    updateHistory(): void;
    backToHistory(item?: DesignHistoryProp): void;
}
export declare class DesignLibraryService {
    private components;
    constructor(components: any);
    get(name: string): any;
}
