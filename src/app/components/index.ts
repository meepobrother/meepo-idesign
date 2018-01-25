import { Test1Component, Test1SettingComponent } from "./test1";
import { Test2Component, Test2SettingComponent } from "./test2";
import { DesignLibraryProp } from '../design/types';
import { Type } from '@angular/core';
const componentsSet: DesignLibraryProp[] = [];

// 添加库
componentsSet.push({
    preview: {
        component: Test1Component
    }, setting: {
        component: Test1SettingComponent
    },
    props: {
        title: 'title1'
    },
    name: 'test1',
    title: '测试1'
});
componentsSet.push({
    preview: {
        component: Test2Component
    },
    setting: {
        component: Test2SettingComponent
    },
    props: {
        title: 'title2'
    },
    name: 'test2',
    title: '测试2'
});

export const entryComponents: Type<any>[] = [
    Test1Component,
    Test1SettingComponent,
    Test2Component,
    Test2SettingComponent
];

export const components: DesignLibraryProp[] = componentsSet;


export const PreviewComponents = [
    {
        name: 'test1',
        component: Test1Component
    },
    {
        name: 'test2',
        component: Test2Component
    }
];