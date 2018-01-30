import { Test1Component, Test1SettingComponent } from "./test1";
import { Test2Component, Test2SettingComponent } from "./test2";
import { BadgeSettingComponent, AntdBadgeComponent } from './antd-mobile/badge';
import { DesignLibraryProp } from 'meepo-idesign-share';
import { Type } from '@angular/core';
const componentsSet: DesignLibraryProp[] = [];
import { both as flexBoth, entrys as flexEntrys, preview as flexPreview } from './weui-flex/public_api';

export class ComponentSet {
    constructor(
        public name: string,
        public title: string,
        public props: any = {},
        public children: any[] = [],
        public state: any = {}
    ) { }
}
// 添加库F
componentsSet.push(new ComponentSet('weui-flex', 'flex容器', { title: 'flex容器' }));
componentsSet.push(new ComponentSet('weui-flex-item', 'flex项目', { title: 'flex项目' }));
componentsSet.push(new ComponentSet('weui-image', '图片', { title: '图片' }));
componentsSet.push(new ComponentSet('weui-button', '按钮', { title: '按钮' }));



// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'WingBlank',
//     title: '两翼留白',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'WhiteSpace',
//     title: '上下留白',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'drawer',
//     title: '抽屉',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'menu',
//     title: '菜单',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'NavBar',
//     title: '导航栏',
//     children: []
// });


// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Popover',
//     title: '气泡',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Pagination',
//     title: '分页器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'SegmentedControl',
//     title: '分段器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Tabs',
//     title: '标签页',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'TabBar',
//     title: '标签栏',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Button',
//     title: '按钮',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Calendar',
//     title: '日历',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Checkbox',
//     title: '复选框',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'DatePicker',
//     title: '日期选择',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'DatePickerView',
//     title: '选择器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'ImagePicker',
//     title: '图片选择器',
//     children: []
// });


// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'InputItem',
//     title: '文本输入',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'PickerView',
//     title: '选择器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Picker',
//     title: '选择器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Radio',
//     title: '单选框',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Range',
//     title: '区域选择',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Switch',
//     title: '滑动开关',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'SearchBar',
//     title: '搜索栏',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Slider',
//     title: '滑动输入条',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Stepper',
//     title: '步进器',
//     children: []
// });

// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'TextareaItem',
//     title: '多行输入',
//     children: []
// });


// componentsSet.push({
//     props: {
//         title: 'title2',
//         children: []
//     },
//     name: 'Accordion',
//     title: '手风琴',
//     children: []
// });

// componentsSet.push({
//     name: 'badge',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '徽标数',
//     children: []
// });

// componentsSet.push({
//     name: 'Card',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '卡片',
//     children: []
// });

// componentsSet.push({
//     name: 'Carousel',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '走马灯',
//     children: []
// });

// componentsSet.push({
//     name: 'Grid',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '宫格',
//     children: []
// });

// componentsSet.push({
//     name: 'Icon',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '图标',
//     children: []
// });

// componentsSet.push({
//     name: 'List',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '列表',
//     children: []
// });

// componentsSet.push({
//     name: 'NoticeBar',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '通告栏',
//     children: []
// });

// componentsSet.push({
//     name: 'Steps',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '步骤条',
//     children: []
// });

// componentsSet.push({
//     name: 'Tag',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '标签',
//     children: []
// });

// componentsSet.push({
//     name: 'ActionSheet',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '动作面板',
//     children: []
// });


// componentsSet.push({
//     name: 'ActivityIndicator',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '活动指示器',
//     children: []
// });

// componentsSet.push({
//     name: 'Modal',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '对话框',
//     children: []
// });

// componentsSet.push({
//     name: 'Progress',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '进度条',
//     children: []
// });

// componentsSet.push({
//     name: 'Toast',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '轻提示',
//     children: []
// });

// componentsSet.push({
//     name: 'PullToRefresh',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '拉动刷新',
//     children: []
// });

// componentsSet.push({
//     name: 'SwipeAction',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '滑动操作',
//     children: []
// });

// componentsSet.push({
//     name: 'ListView',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '长列表',
//     children: []
// });


// componentsSet.push({
//     name: 'Result',
//     props: {
//         text: '0',
//         hot: true,
//         children: []
//     },
//     title: '结果页',
//     children: []
// });


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

export interface SettingAndView {
    setting: Type<any>;
    view: Type<any>;
}

export interface SettingAndViewS {
    [key: string]: SettingAndView;
}

export const libraryComponents: SettingAndViewS = {
    badge: {
        view: AntdBadgeComponent,
        setting: BadgeSettingComponent
    }
}