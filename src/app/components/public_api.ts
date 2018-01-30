import { DesignLibraryProp } from 'meepo-idesign-share';
import { CreateLib } from 'ng-react-component';
import { Type } from '@angular/core';

const componentsSet: DesignLibraryProp[] = [];
// 添加库F
componentsSet.push(new CreateLib('weui-flex', 'flex容器', { title: 'flex容器' }));
componentsSet.push(new CreateLib('weui-flex-item', 'flex项目', { title: 'flex项目' }));
componentsSet.push(new CreateLib('weui-image', '图片', { title: '图片' }));
componentsSet.push(new CreateLib('weui-button', '按钮', { title: '按钮' }));

export const components: DesignLibraryProp[] = componentsSet;
