import { Directive, HostBinding } from '@angular/core';
import { prefixCls } from '../val';

@Directive({ selector: '[menuSubmenu]'})
export class MenuSubmenuDirective {
    @HostBinding('class')
    get listHeader() {
        return `am-flexbox-item am-menu-select-container-submenu`;
    }
    constructor() { }
}
