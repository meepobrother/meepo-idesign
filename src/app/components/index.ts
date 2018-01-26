import { Test1Component, Test1SettingComponent } from "./test1";
import { Test2Component, Test2SettingComponent } from "./test2";
import { BadgeSettingComponent, AntdBadgeComponent } from './antd-mobile/badge';
import { DesignLibraryProp } from '../design/types';
import { Type } from '@angular/core';
const componentsSet: DesignLibraryProp[] = [];

// 添加库
componentsSet.push({
    preview: {
        component: AntdBadgeComponent
    }, setting: {
        component: BadgeSettingComponent
    },
    props: {
        text: '0',
        hot: true,
        children: []
    },
    name: 'badge',
    title: '徽标数'
});
componentsSet.push({
    preview: {
        component: Test2Component
    },
    setting: {
        component: Test2SettingComponent
    },
    props: {
        title: 'title2',
        children: []
    },
    name: 'test2',
    title: '测试2'
});

export const entryComponents: Type<any>[] = [
    AntdBadgeComponent,
    BadgeSettingComponent,
    Test2Component,
    Test2SettingComponent
];

export const components: DesignLibraryProp[] = componentsSet;


export const PreviewComponents = [
    {
        name: 'badge',
        component: AntdBadgeComponent
    },
    {
        name: 'test2',
        component: Test2Component
    }
];