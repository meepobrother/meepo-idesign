import {
    Component, OnInit, ViewChild, ElementRef,
    Host, Optional, Injectable, Output, EventEmitter,
    InjectionToken, Inject
} from '@angular/core';
import { HostBinding, ViewEncapsulation } from '@angular/core';
import { DesignLibraryProp, DesignHistoryProp, DesignLibraryService, DesignPropsService, DesignApiService } from 'meepo-idesign-share';
import { guid } from './uuid';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';
import { ReactComponent } from 'ng-react-component';
export function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
// 设置
@Component({
    selector: 'design-setting',
    templateUrl: './design-setting.html',
    styleUrls: ['./design-setting.scss']
})
export class DesignSettingComponent implements OnInit {
    @HostBinding('class.meepo-design-setting') _setting: boolean = true;
    item: DesignLibraryProp;
    instance: ReactComponent<any, any>;
    constructor(
        public props: DesignPropsService,
        public api: DesignApiService,
    ) {
    }
    ngOnInit() {
    }
    setSetting(com: DesignLibraryProp, instance?: any) {
        this.item = com;
        this.instance = instance;
    }

    setTopProps() {
        this.props.settingProps = null;
    }
    // 设置激活元素
    setItemProps(item: any) {
        const instance = this.api.get(item.uuid);
        this.props.setActiveSettingProps(item, instance.view.instance);
    }

    addComponent(e: any) {
        this.props.addPropsToInstanceByName(e);
    }

    removeComponent(uuid: string) {
        this.props.removePropsByUid(uuid);
    }

    toFatherProps(e: any) {
        this.props.toFatherProps();
    }
}
// 预览
@Component({
    selector: 'design-preview',
    templateUrl: './design-preview.html',
    styleUrls: ['./design-preview.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DesignPreviewComponent implements OnInit {
    @HostBinding('class.meepo-design-preview') _preview: boolean = true;
    @Output() doClick: EventEmitter<any> = new EventEmitter();
    directives: any = {
        name: 'device-iphone-8 device-gold',
        color: '',
        src: './assets/img/bg-03.jpg',
        type: 'image'
    };

    onClick: any = (e: DesignLibraryProp, instance: any) => {
        this.doClick.emit({ props: e, instance: instance });
    }

    isOpen: boolean = false;
    constructor(
        public props: DesignPropsService
    ) { }
    ngOnInit() { }

    _showMore(e: DesignLibraryProp) {
        console.log('显示操作提示');
    }

    addComponent(name: string) {
        this.props.addPropByName(name);
    }

    removeComponent(uuid: string) {
        this.props.removePropsByUid(uuid);
    }
}
// 组件库
@Component({
    selector: 'design-library',
    templateUrl: './design-library.html'
})
export class DesignLibraryComponent implements OnInit {
    @HostBinding('class.meepo-design-library') _library: boolean = true;
    components: DesignLibraryProp[] = [];
    constructor(
        private props: DesignPropsService
    ) { }

    ngOnInit() {
        this.components = this.props.props;
    }
}
// 操作历史
@Component({
    selector: 'design-history',
    templateUrl: './design-history.html'
})
export class DesignHistoryComponent implements OnInit {
    @HostBinding('class.meepo-design-history') _history: boolean = true;
    constructor(
        public props: DesignPropsService
    ) { }
    ngOnInit() { }

    getLocal(): DesignHistoryProp[] {
        return this.props.getHistory();
    }

    backToHistory(item: DesignHistoryProp) {
        this.props.backToHistory(item);
    }
}
export const DESIGN_PAGES = new InjectionToken('DESIGN_PAGES');
@Component({
    selector: 'design-pages',
    templateUrl: './design-pages.html'
})
export class DesignPagesComponent implements OnInit {
    pages: any[] = [];
    constructor(
        @Inject(DESIGN_PAGES) pages: any[],
        public props: DesignPropsService
    ) {
        this.pages = pages;
    }
    ngOnInit() { }

    previewPage(item: any) {
        this.props.pageProps = item.props;
    }

    savePage() {
        console.log(this.pages);
    }
}

// 容器
@Component({
    selector: 'design',
    templateUrl: './design.html',
    styleUrls: ['./design.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DesignComponent implements OnInit {
    @HostBinding('class.meepo-design') _design: boolean = true;

    @ViewChild(DesignSettingComponent) _setting: DesignSettingComponent;
    @ViewChild(DesignLibraryComponent) _library: DesignLibraryComponent;
    @ViewChild(DesignPreviewComponent) _preview: DesignPreviewComponent;
    @ViewChild(DesignHistoryComponent) _history: DesignHistoryComponent;
    @ViewChild(DesignPagesComponent) _pages: DesignPagesComponent;

    activeHistory: boolean = false;

    constructor(
        private props: DesignPropsService,
        private router: Router
    ) { }
    ngOnInit() {

    }

    setSetting(com: { props: DesignLibraryProp, instance: any }) {
        this._setting.setSetting(com.props, com.instance);
    }

    saveToHistory() {
        this.props.updateHistory();
    }

    previewToHistory() {
        this.router.navigate(['preview'])
    }

    postToHistory() {
        console.log('postToHistory');
        this._pages.savePage();
    }

    removeComponent(uuid: string) {
        this.props.removePropsByUid(uuid);
    }
}
