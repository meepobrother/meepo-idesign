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

export const components: DesignLibraryProp[] = componentsSet;
