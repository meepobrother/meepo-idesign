import { InjectionToken, Injector } from '@angular/core';
export declare const historyKey = "historyKey";
import { DesignHistoryProp, DesignLibraryProp, DesignLibraryService } from 'meepo-idesign-share';
import { Subject } from 'rxjs/Subject';
export declare const DESIGN_COMPONENTS: InjectionToken<{}>;
export declare class DesignService {
    private injector;
    private library;
    _historys: DesignHistoryProp[];
    historys: DesignHistoryProp[];
    history$: Subject<DesignHistoryProp[]>;
    data: DesignLibraryProp[];
    data$: Subject<DesignLibraryProp[]>;
    allComponents: DesignLibraryProp[];
    components: DesignLibraryProp[][];
    previewComponents: DesignLibraryProp[];
    previewComponents$: Subject<any>;
    constructor(injector: Injector, _allcomponents: any, library: DesignLibraryService);
    removeComponentByUuid(uuid: string): void;
    getComponentByName(name: string): DesignLibraryProp;
    getHistory(): DesignHistoryProp[];
    updateHistory(data: DesignHistoryProp[]): void;
    backToHistory(item?: DesignHistoryProp): void;
}
