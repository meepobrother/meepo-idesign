import { Directive, HostBinding } from '@angular/core';
import { listPrefixCls } from '../var';

@Directive({ selector: '[listFooter]' })
export class ListFooterDirective {
    @HostBinding('class')
    get listHeader() {
        return `${listPrefixCls}-footer`;
    }
    constructor() { }
}
