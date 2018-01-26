import {
    Component, OnInit, ViewChild, ElementRef,
    Host, Optional, Injectable, Output, EventEmitter,
    InjectionToken, Inject
} from '@angular/core';
import { HostBinding, ViewEncapsulation } from '@angular/core';
import { DesignLibraryProp, DesignHistoryProp } from './types';
import { guid } from './uuid';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DesignService } from './design.service';
import { Router } from '@angular/router';
export function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
// 设置
@Component({
    selector: 'design-setting',
    templateUrl: './design-setting.html'
})
export class DesignSettingComponent implements OnInit {
    @HostBinding('class.meepo-design-setting') _setting: boolean = true;
    item: DesignLibraryProp;
    constructor() { }
    ngOnInit() { }
    setSetting(com: DesignLibraryProp) {
        this.item = com;
    }
}
// 预览
@Component({
    selector: 'design-preview',
    templateUrl: './design-preview.html'
})
export class DesignPreviewComponent implements OnInit {
    @HostBinding('class.meepo-design-preview') _preview: boolean = true;
    @Output() doClick: EventEmitter<any> = new EventEmitter();
    components: DesignLibraryProp[] = [];
    historys: DesignHistoryProp[];

    directives: any = {
        name: 'device-iphone-8 device-gold',
        color: '',
        src: './assets/img/bg-03.jpg',
        type: 'image'
    };

    onClick: any = (e: DesignLibraryProp) => {
        this.doClick.emit(e);
    }

    isOpen: boolean = false;

    constructor(
        private history: DesignService
    ) {
        this.history.data$.subscribe(res => {
            this.components = res;
        });
    }

    ngOnInit() {
        // 最后一次操作
        try {
            this.history.backToHistory();
            this.historys = this.history.historys;
        } catch (err) {
            localStorage.clear();
        }
        this.history.previewComponents = this.components;

        this.history.previewComponents$.subscribe(res => {
            console.log(res);
            this.components = res;
        });
    }

    _showMore(e: DesignLibraryProp) {
        console.log('显示操作提示');
    }

    addComponent(name: string) {
        try {
            const com = this.history.getComponentByName(name);
            if (com) {
                this.components.push(deepCopy(com));
                this.updateCache();
            }
        } catch (err) {
            console.log('undefined err', err);
        }
    }

    removeComponent(uuid: string) {
        let idx: number = 0;
        this.components.map((com: DesignLibraryProp, index: number) => {
            if (com.uuid === uuid) {
                idx = index;
            }
        });
        this.components.splice(idx, 1);
        this.updateCache();
    }
    updateCache() {
        const now = new Date();
        const components = JSON.stringify(this.components)
        const history: DesignHistoryProp = {
            name: now.toISOString(),
            data: JSON.parse(components)
        };
        this.historys = this.historys || [];
        this.historys.unshift(history);
        this.history.updateHistory(this.historys);
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
        private history: DesignService
    ) { }

    ngOnInit() {
        this.components = this.history.allComponents;
    }
}
// 操作历史
@Component({
    selector: 'design-history',
    templateUrl: './design-history.html'
})
export class DesignHistoryComponent implements OnInit {
    @HostBinding('class.meepo-design-history') _history: boolean = true;
    items: DesignHistoryProp[] = [];
    constructor(
        public history: DesignService
    ) {
        this.items = this.getLocal();
    }
    ngOnInit() {
        this.history.history$.subscribe(res => {
            this.items = res;
        });
    }

    getLocal(): DesignHistoryProp[] {
        return this.history.getHistory();
    }

    backToHistory(item: DesignHistoryProp) {
        this.history.backToHistory(item);
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
        @Inject(DESIGN_PAGES) pages: any[]
    ) {
        this.pages = pages;
    }
    ngOnInit() { }
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
        private history: DesignService,
        private router: Router
    ) { }
    ngOnInit() {

    }

    setSetting(com: DesignLibraryProp) {
        this._setting.setSetting(com);
    }

    saveToHistory() {
        this._preview.updateCache();
    }

    previewToHistory() {
        this.router.navigate(['preview'])
    }

    postToHistory() { }
}
