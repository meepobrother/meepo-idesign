import { OnInit, EventEmitter, InjectionToken } from '@angular/core';
import { DesignLibraryProp, DesignHistoryProp, DesignPropsService } from 'meepo-idesign-share';
import { Router } from '@angular/router';
import { ReactComponent } from 'ng-react-component';
export declare function deepCopy(obj: any): any;
export declare class DesignSettingComponent implements OnInit {
    _setting: boolean;
    item: DesignLibraryProp;
    instance: ReactComponent<any, any>;
    constructor();
    ngOnInit(): void;
    setSetting(com: DesignLibraryProp, instance?: any): void;
}
export declare class DesignPreviewComponent implements OnInit {
    props: DesignPropsService;
    _preview: boolean;
    doClick: EventEmitter<any>;
    directives: any;
    onClick: any;
    isOpen: boolean;
    constructor(props: DesignPropsService);
    ngOnInit(): void;
    _showMore(e: DesignLibraryProp): void;
    addComponent(name: string): void;
    removeComponent(uuid: string): void;
}
export declare class DesignLibraryComponent implements OnInit {
    private props;
    _library: boolean;
    components: DesignLibraryProp[];
    constructor(props: DesignPropsService);
    ngOnInit(): void;
}
export declare class DesignHistoryComponent implements OnInit {
    props: DesignPropsService;
    _history: boolean;
    constructor(props: DesignPropsService);
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
    private props;
    private router;
    _design: boolean;
    _setting: DesignSettingComponent;
    _library: DesignLibraryComponent;
    _preview: DesignPreviewComponent;
    _history: DesignHistoryComponent;
    _pages: DesignPagesComponent;
    activeHistory: boolean;
    constructor(props: DesignPropsService, router: Router);
    ngOnInit(): void;
    setSetting(com: {
        props: DesignLibraryProp;
        instance: any;
    }): void;
    saveToHistory(): void;
    previewToHistory(): void;
    postToHistory(): void;
}
