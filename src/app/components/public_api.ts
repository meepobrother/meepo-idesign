import { DesignLibraryProp } from 'meepo-idesign-share';
import { CreateLib } from 'ng-react-component';
import { Type } from '@angular/core';

const componentsSet: DesignLibraryProp[] = [];
// 添加库F
componentsSet.push(new CreateLib('weui-flex', 'flex容器', { title: 'flex容器' }));
componentsSet.push(new CreateLib('weui-flex-item', 'flex项目', { title: 'flex项目' }));
componentsSet.push(new CreateLib('weui-image', '图片', { title: '图片' }));
componentsSet.push(new CreateLib('weui-button', '按钮', { title: '按钮' }));

componentsSet.push(new CreateLib('weui-header', '头部导航', { title: '按钮' }));
componentsSet.push(new CreateLib('weui-city', '城市切换', { title: '按钮' }));

componentsSet.push(new CreateLib('weui-body', '主要内容', { title: '按钮' }));
componentsSet.push(new CreateLib('weui-footer', '底部导航', { title: '按钮' }));


export const components: DesignLibraryProp[] = componentsSet;

export { runnerPage } from './runner-new/public_api';