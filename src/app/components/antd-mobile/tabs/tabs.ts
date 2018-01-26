import {
    Component, OnInit, Input,
    Output, EventEmitter, HostBinding,
    ViewEncapsulation, ContentChildren, QueryList,
    Injectable, AfterContentInit, OnDestroy
} from '@angular/core';
import { prefixCls, tabsDefaultBarPrefixCls } from './var';
import { ansycClassObj, merge, setClassObj } from 'meepo-common';
import { TabItemComponent } from './tab-item/tab-item';
import { TabPanelComponent } from './tab-panel/tab-panel';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.html',
    styleUrls: ['./tabs.less', './patch.less'],
    encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements OnInit, AfterContentInit, OnDestroy {
    @Input() prefixCls: string = prefixCls;
    @ContentChildren(TabItemComponent) bars: QueryList<TabItemComponent>;
    @ContentChildren(TabPanelComponent) panels: QueryList<TabPanelComponent>;

    // tabs
    _tabsClass: Object = {};
    _tabsBarWrap: Object = {};
    _tabsDefaultBar: Object = {};
    _barUnderlineClass: Object = {};
    _tabsContentWrapClass: Object = {};

    @HostBinding(`class`)
    get tabsClass() {
        return ansycClassObj(this._tabsClass);
    }

    get tabsBarWrapClass() {
        return ansycClassObj(this._tabsBarWrap);
    }

    get tabbsDefaultBar() {
        return ansycClassObj(this._tabsDefaultBar);
    }

    get barUnderlineClass() {
        return ansycClassObj(this._barUnderlineClass);
    }

    get tabsContentWrapClass() {
        return ansycClassObj(this._tabsContentWrapClass);
    }

    @Input()
    set tabDirection(val: 'horizontal' | 'vertical') {
        this._tabsClass = setClassObj('horizontal,vertical', this._tabsClass, val, prefixCls);
    }
    @Input()
    set tabBarPosition(val: 'left' | 'right' | 'top' | 'bottom') {
        this._tabsClass = setClassObj('left,right,top,bottom', this._tabsClass, val, prefixCls);
        this._tabsDefaultBar = setClassObj('left,right,top,bottom', this._tabsDefaultBar, val, tabsDefaultBarPrefixCls);
    }

    @Input()
    set animated(val: boolean) {
        this._tabsDefaultBar[`${tabsDefaultBarPrefixCls}-animated`] = val;
        this._tabsContentWrapClass[`${prefixCls}-content-wrap-animated`] = val;
    }

    @Input() activeIndex: number = 0;

    sub$: any;
    page: TabPanelComponent;

    constructor() {
        this._tabsClass[`${prefixCls}`] = true;
        this._tabsClass[`${prefixCls}-top`] = true;
        this._tabsClass[`${prefixCls}-horizontal`] = true;

        // tabs bar wrap
        this._tabsBarWrap[`${prefixCls}-bar-wrap`] = true;
        // tabs default bar 
        this._tabsDefaultBar[`${tabsDefaultBarPrefixCls}`] = true;

        this._barUnderlineClass[`${tabsDefaultBarPrefixCls}-underline`] = true;
        this._tabsDefaultBar[`${tabsDefaultBarPrefixCls}-animated`] = true;
        this._tabsDefaultBar[`${tabsDefaultBarPrefixCls}-top`] = true;

        this._tabsContentWrapClass[`${prefixCls}-content-wrap`] = true;
        this._tabsContentWrapClass[`${prefixCls}-content-wrap-animated`] = true;
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.sub$.unsubscribe();
    }
    ngAfterContentInit() {
        const subs: any[] = [];
        const panels: any[] = [];
        this.bars.map((bar: TabItemComponent, index: number) => {
            subs.push(bar.onClick);
            panels[index] = bar.panel;
        });
        this.panels.reset(panels);
        this.sub$ = merge(...subs)
            .startWith(this.activeIndex)
            .map(res => Number(res))
            .subscribe((res: number) => {
                // 处理激活状态
                this.bars.map((bar, index) => {
                    bar.setActive(res === index);
                });
                this.activeIndex = res;
                this.page = this.panels.find((item, index, panels) => {
                    return res === index;
                });
            })
    }
}
