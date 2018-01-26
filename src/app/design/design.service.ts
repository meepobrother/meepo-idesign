import { Injectable, InjectionToken, Inject, Injector } from '@angular/core';
export const historyKey = 'historyKey';
import { DesignHistoryProp, DesignLibraryProp } from './types';
import { Subject } from 'rxjs/Subject';
export const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');

@Injectable()
export class DesignService {
    historys: DesignHistoryProp[] = [];
    history$: Subject<DesignHistoryProp[]> = new Subject();

    data: DesignLibraryProp[] = [];
    data$: Subject<DesignLibraryProp[]> = new Subject();

    allComponents: DesignLibraryProp[] = [];
    components: DesignLibraryProp[][];


    previewComponents: DesignLibraryProp[] = [];
    previewComponents$: Subject<any> = new Subject();

    constructor(
        private injector: Injector,
        @Inject(DESIGN_COMPONENTS) _allcomponents: any
    ) { }

    setComponents() {
        this.components = this.injector.get(DESIGN_COMPONENTS) as DesignLibraryProp[][];
        this.allComponents = [];
        this.components.map(coms => {
            coms.forEach(com => {
                this.allComponents.push(com);
            });
        });
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
            return JSON.parse(local) as DesignHistoryProp[];
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

    backToHistory(item: DesignHistoryProp) {
        this.data = item.data;
        this.data$.next(this.data);
    }
}