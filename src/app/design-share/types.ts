import { Type, Injector, NgModuleFactory } from '@angular/core';
function flatten<T>(arr: T[][]): T[] {
    return Array.prototype.concat.apply([], arr);
}
// 页面组件结构
export interface DesignLibraryProp {
    children: DesignLibraryProp[];
    name: string;
    uuid?: string;
    props: any,
    state?: any,
    title: string;
}
// 历史记录结构
export interface DesignHistoryProp {
    name: string;
    data: DesignLibraryProp[];
}

import { Injectable, InjectionToken, Inject } from '@angular/core';
export const DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');

@Injectable()
export class DesignApiService {
    constructor() { }
    // 获取一个页面参数
    get(id: string) { }
    // 保存一个页面参数
    save(data: any, id: string) { }
}
export const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
@Injectable()
export class DesignPropsService {
    // 所有props
    props: any[] = [];
    // 当前页面
    pageProps: any[] = [];
    // 设置
    settingProps: any = {};

    historyKey: string = 'historyKey';
    // 历史记录
    historys: any[] = [];

    constructor(
        @Inject(DESIGN_COMPONENTS) props: any
    ) {
        this.props = flatten(props);
        try {
            this.backToHistory();
        } catch (err) {
            localStorage.clear();
        }
    }

    getPropsByName(name: string): DesignLibraryProp {
        let com: DesignLibraryProp;
        this.props.forEach((item) => {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    }

    addPropByName(name: string){
        const com = this.getPropsByName(name);
        this.pageProps.push(com);
        this.updateHistory();
    }

    removePropsByUid(uuid: string) {
        let thisIndex: any;
        this.pageProps.map((res: DesignLibraryProp, index: number) => {
            if (res.uuid === uuid) {
                thisIndex = index;
            }
        });
        this.pageProps.splice(thisIndex, 1);
        this.updateHistory();
    }

    getHistory(): DesignHistoryProp[] {
        let local = localStorage.getItem(this.historyKey);
        if (local) {
            const items = JSON.parse(local) as DesignHistoryProp[];
            return items;
        } else {
            return [];
        }
    }

    updateHistory(): void {
        this.historys.unshift({
            name: new Date().toISOString(),
            data: this.pageProps
        });
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(this.historyKey, JSON.stringify(this.historys));
    }

    backToHistory(item: DesignHistoryProp = null) {
        if (!item) {
            item = this.getHistory()[0];
        }
        this.pageProps = item.data;
    }
}

@Injectable()
export class DesignLibraryService {
    private components: { [key: string]: Type<any> }[] = [];
    constructor(
        @Inject(DESIGN_LIBRARYS) components: any
    ) {
        this.components = flatten(components);
        console.log('DesignLibraryService', this.components);
    }
    get(name: string) {
        let com: any;
        this.components.map(item => {
            if (item[name]) {
                com = item[name];
            }
        });
        return com;
    }
}