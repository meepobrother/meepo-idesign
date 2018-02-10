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
import { entrys as meepoMobileEntrys, both as meepoMobileBoth, MeepoMobileSettingComponent } from './meepo-mobile/public_api';

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
        this.props.pageProps = this.props.deepCopy(item.props);
    }

    savePage() { }
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

    @ViewChild(MeepoMobileSettingComponent) _setting: MeepoMobileSettingComponent;
    @ViewChild(DesignLibraryComponent) _library: DesignLibraryComponent;
    @ViewChild(DesignHistoryComponent) _history: DesignHistoryComponent;
    @ViewChild(DesignPagesComponent) _pages: DesignPagesComponent;

    activeHistory: boolean = false;

    constructor(
        private props: DesignPropsService,
        private router: Router
    ) { }

    ngOnInit() { }

    setSetting(com: { props: DesignLibraryProp, instance: any }) {
        console.log('com', com);
        this._setting.setSetting(com.props, com.instance);
    }

    saveToHistory() {
        this.props.updateHistory();
    }

    previewToHistory() {
        this.router.navigate(['preview'])
    }

    postToHistory() {
        this._pages.savePage();
    }

    removeComponent(uuid: string) {
        this.props.removePropsByUid(uuid);
    }
}
