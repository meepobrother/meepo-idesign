import { Type, Injector, NgModuleFactory } from '@angular/core';

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

import { flatten } from 'meepo-common';
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

@Injectable()
export class DesignLibraryService {
    private components: { [key: string]: Type<any> }[] = [];
    constructor(
        @Inject(DESIGN_LIBRARYS) components: any
    ) {
        this.components = flatten(components);
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