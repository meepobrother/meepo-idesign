import { OnInit, EventEmitter, InjectionToken } from '@angular/core';
import { DesignLibraryProp, DesignHistoryProp } from 'meepo-idesign-share';
import { DesignService } from './design.service';
import { Router } from '@angular/router';
export declare function deepCopy(obj: any): any;
export declare class DesignSettingComponent implements OnInit {
    _setting: boolean;
    item: DesignLibraryProp;
    constructor();
    ngOnInit(): void;
    setSetting(com: DesignLibraryProp): void;
}
export declare class DesignPreviewComponent implements OnInit {
    private history;
    _preview: boolean;
    doClick: EventEmitter<any>;
    components: DesignLibraryProp[];
    historys: DesignHistoryProp[];
    directives: any;
    onClick: any;
    isOpen: boolean;
    constructor(history: DesignService);
    ngOnInit(): void;
    _showMore(e: DesignLibraryProp): void;
    addComponent(name: string): void;
    removeComponent(uuid: string): void;
    updateCache(): void;
}
export declare class DesignLibraryComponent implements OnInit {
    private history;
    _library: boolean;
    components: DesignLibraryProp[];
    constructor(history: DesignService);
    ngOnInit(): void;
}
export declare class DesignHistoryComponent implements OnInit {
    history: DesignService;
    _history: boolean;
    items: DesignHistoryProp[];
    constructor(history: DesignService);
    ngOnInit(): void;
    getLocal(): DesignHistoryProp[];
    backToHistory(item: DesignHistoryProp): void;
}
export declare const DESIGN_PAGES: InjectionToken<{}>;
export declare class DesignPagesComponent implements OnInit {
    pages: any[];
    constructor(pages: any[]);
    ngOnInit(): void;
}
export declare class DesignComponent implements OnInit {
    private history;
    private router;
    _design: boolean;
    _setting: DesignSettingComponent;
    _library: DesignLibraryComponent;
    _preview: DesignPreviewComponent;
    _history: DesignHistoryComponent;
    _pages: DesignPagesComponent;
    activeHistory: boolean;
    constructor(history: DesignService, router: Router);
    ngOnInit(): void;
    setSetting(com: DesignLibraryProp): void;
    saveToHistory(): void;
    previewToHistory(): void;
    postToHistory(): void;
}
