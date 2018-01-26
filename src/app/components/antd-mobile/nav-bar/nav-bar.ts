import {
    Component, OnInit, ViewEncapsulation,
    HostBinding, Input, ContentChild, TemplateRef
} from '@angular/core';
import { navbarPrefixCls } from './val';
import { ansycClassObj, merge, setClassObj, isMeepoTrue } from 'meepo-common';
@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.html',
    styleUrls: ['./nav-bar.less', './patch.less'],
    encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {
    navbarPrefixCls: string = navbarPrefixCls;
    @ContentChild('left') left: TemplateRef<any>;
    @ContentChild('right') right: TemplateRef<any>;
    
    @Input() class: string = '';
    _classObj: Object = {
        [`${navbarPrefixCls}`]: true
    };
    @HostBinding('class')
    get navBarClass() {
        return ansycClassObj(this._classObj);
    }

    @Input()
    set light(val: any) {
        this._classObj[`${navbarPrefixCls}-light`] = isMeepoTrue(val);
    }

    constructor() { }

    ngOnInit() { }
}
