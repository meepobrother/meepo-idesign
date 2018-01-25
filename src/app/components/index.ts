import { Test1Component } from "./test1";
import { Test2Component } from "./test2";
import { DesignLibraryProp } from '../design/types';
import { Type } from '@angular/core';
const componentsSet: DesignLibraryProp[] = [];

// 添加库
componentsSet.push({
    preview: {
        component: Test1Component
    }, setting: {
        component: Test1Component
    },
    name: 'test1'
});
componentsSet.push({
    preview: {
        component: Test2Component
    },
    setting: {
        component: Test2Component
    },
    name: 'test2'
});

export const entryComponents: Type<any>[] = [
    Test1Component,
    Test2Component
];

export const components: DesignLibraryProp[] = componentsSet;
