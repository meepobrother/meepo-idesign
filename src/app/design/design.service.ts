import { Injectable, InjectionToken, Inject, Injector } from '@angular/core';
export const historyKey = 'historyKey';
import { DesignHistoryProp, DesignLibraryProp, DesignLibraryService } from 'meepo-idesign-share';
import { Subject } from 'rxjs/Subject';
export const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
function flatten<T>(arr: T[][]): T[] {
    return Array.prototype.concat.apply([], arr);
}
@Injectable()
export class DesignService {
    _historys: DesignHistoryProp[] = [];
    set historys(val: DesignHistoryProp[]) {
        this._historys = val;
    }
    get historys() {
        return this._historys || [];
    }
    history$: Subject<DesignHistoryProp[]> = new Subject();

    data: DesignLibraryProp[] = [];
    data$: Subject<DesignLibraryProp[]> = new Subject();

    allComponents: DesignLibraryProp[] = [];
    components: DesignLibraryProp[][];


    previewComponents: DesignLibraryProp[] = [];
    previewComponents$: Subject<any> = new Subject();

    constructor(
        private injector: Injector,
        @Inject(DESIGN_COMPONENTS) _allcomponents: any,
        private library: DesignLibraryService
    ) { 
        this.allComponents = flatten(_allcomponents);
    }

    removeComponentByUuid(uuid: string) {
        let thisIndex: any;
        this.previewComponents.map((res: DesignLibraryProp, index: number) => {
            if (res.uuid === uuid) {
                thisIndex = index;
            }
        });
        this.previewComponents.splice(thisIndex, 1);
        this.previewComponents$.next(this.previewComponents);
    }

    getComponentByName(name: string): DesignLibraryProp {
        let com: DesignLibraryProp;
        this.allComponents.forEach((item) => {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    }

    getHistory(): DesignHistoryProp[] {
        let local = localStorage.getItem(historyKey);
        if (local) {
            const items = JSON.parse(local) as DesignHistoryProp[];
            return items;
        } else {
            return [];
        }
    }

    updateHistory(data: DesignHistoryProp[]): void {
        this.historys = data;
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(historyKey, JSON.stringify(this.historys));
        this.history$.next(this.historys);
    }

    backToHistory(item: DesignHistoryProp = null) {
        if (!item) {
            item = this.getHistory()[0];
        }
        this.data = item.data;
        this.data$.next(this.data);
    }
}

function type(val: any): string {
    return typeof val;
}