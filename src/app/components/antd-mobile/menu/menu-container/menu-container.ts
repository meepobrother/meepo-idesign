import { Directive, HostBinding } from '@angular/core';
import { prefixCls } from '../val';

@Directive({ selector: '[menuContainer]'})
export class MenuContainerDirective {
    @HostBinding('class')
    get listHeader() {
        return `am-flexbox am-menu-select-container am-flexbox-align-start`;
    }
    constructor() { }
}
