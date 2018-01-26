import { Directive, HostBinding } from '@angular/core';
import { listPrefixCls } from '../var';

@Directive({ selector: '[listHeader],list-header' })
export class ListHeaderDirective {
    @HostBinding('class')
    get listHeader() {
        return `${listPrefixCls}-header`;
    }
    constructor() { }
}
