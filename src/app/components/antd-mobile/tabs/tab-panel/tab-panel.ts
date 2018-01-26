import {
    Component, ViewEncapsulation,
    HostBinding, Input, TemplateRef,
    ViewChild, HostListener, EventEmitter, Output
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { prefixCls } from '../var';
import { ansycClassObj } from 'meepo-common';
import { TabsComponent } from '../tabs';
@Component({
    selector: '[tabPanel],tab-panel',
    templateUrl: './tab-panel.html',
    encapsulation: ViewEncapsulation.None
})
export class TabPanelComponent {
    @ViewChild('ref') tpl: TemplateRef<any>;
    _tabBarClass: Object = {
        [`${prefixCls}-pane-wrap`]: true,
        [`${prefixCls}-pane-wrap-active`]: true
    };
    @Output() onActive: EventEmitter<any> = new EventEmitter();
    time: any = new Date().getTime();
    get tabBarClass() {
        return ansycClassObj(this._tabBarClass);
    }

    constructor() { }

    setActive(val) {
        if (val) {
            this.onActive.emit(this);
        }
    }
}
