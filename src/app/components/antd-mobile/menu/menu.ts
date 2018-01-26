import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { ansycClassObj, merge, setClassObj } from 'meepo-common';
import { prefixCls, flexPrefixCls } from './val';

@Component({
    selector: 'menu',
    templateUrl: './menu.html',
    styleUrls: ['./menu.less', './patch.less'],
    encapsulation: ViewEncapsulation.None
})
export class MenuComponent {
    prefixCls: string = prefixCls;
    _menuClass: Object = {
        [`${prefixCls}`]: true,
        [`${flexPrefixCls}`]: true,
        [`${flexPrefixCls}-dir-column`]: true,
        [`${flexPrefixCls}-align-stretch`]: true,
        [`${flexPrefixCls}-align-stretch`]: true,
        [`single-foo-menu`]: true
    };
    @HostBinding('class')
    get menuClass() {
        return ansycClassObj(this._menuClass);
    }

    _menuSelectContainerClass: Object = {
        [`${flexPrefixCls}`]: true,
        [`${prefixCls}-select-container`]: true,
        [`${flexPrefixCls}-align-start`]: true,
    }

    get menuSelectContainerClass(){
        return ansycClassObj(this._menuSelectContainerClass);
    }
    _menuSelectContainerSubmenu: Object = {
        [`${prefixCls}-select-container-submenu`]: true,
        [`${flexPrefixCls}-item`]: true,
    };

    get menuSelectContainerSubmenu(){
        return ansycClassObj(this._menuSelectContainerSubmenu);
    }

    constructor(){

    }
}


