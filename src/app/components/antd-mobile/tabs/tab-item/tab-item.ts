import {
    Component, ViewEncapsulation,
    HostBinding, Input, TemplateRef,
    ViewChild, HostListener, EventEmitter, Output,
    AfterContentInit, ContentChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { tabsDefaultBarPrefixCls } from '../var';
import { ansycClassObj } from 'meepo-common';
import { TabsComponent } from '../tabs';
import { TabPanelComponent } from '../tab-panel/tab-panel';
@Component({
    selector: '[tabItem],tab-item',
    templateUrl: './tab-item.html',
    encapsulation: ViewEncapsulation.None
})
export class TabItemComponent implements AfterContentInit {
    @ViewChild('ref') tpl: TemplateRef<any>;
    @ContentChild(TabPanelComponent) panel: TabPanelComponent;
    _tabBarClass: Object = {};
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    get tabBarClass() {
        return ansycClassObj(this._tabBarClass);
    }

    constructor() {
        this._tabBarClass[`${tabsDefaultBarPrefixCls}-tab`] = true;
    }

    setActive(val) {
        this._tabBarClass[`am-tabs-default-bar-tab-active`] = val;
    }

    ngAfterContentInit() { }

    _click(e) {
        this.onClick.emit(e);
    }
}
