(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/router'), require('rxjs/observable/fromEvent')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/router', 'rxjs/observable/fromEvent'], factory) :
	(factory((global['meepo-idesign'] = {}),global.ng.core,global.ng.common,global.ng.router,global.Rx.Observable));
}(this, (function (exports,core,common,router,fromEvent) { 'use strict';

/**
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
var DESIGN_LIBRARYS = new core.InjectionToken('DESIGN_LIBRARYS');
var DesignApiService = (function () {
    function DesignApiService() {
    }
    /**
     * @param {?} id
     * @return {?}
     */
    DesignApiService.prototype.get = function (id) { };
    /**
     * @param {?} data
     * @param {?} id
     * @return {?}
     */
    DesignApiService.prototype.save = function (data, id) { };
    return DesignApiService;
}());
DesignApiService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DesignApiService.ctorParameters = function () { return []; };
var DESIGN_COMPONENTS = new core.InjectionToken('DESIGN_COMPONENTS');
var DesignPropsService = (function () {
    /**
     * @param {?} props
     */
    function DesignPropsService(props) {
        // 所有props
        this.props = [];
        // 当前页面
        this.pageProps = [];
        // 设置
        this.settingProps = {};
        this.historyKey = 'historyKey';
        // 历史记录
        this.historys = [];
        this.props = flatten(props);
        try {
            this.backToHistory();
        }
        catch (err) {
            localStorage.clear();
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.getPropsByName = function (name) {
        var /** @type {?} */ com;
        this.props.forEach(function (item) {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.addPropByName = function (name) {
        var /** @type {?} */ com = this.getPropsByName(name);
        this.pageProps.push(com);
        this.updateHistory();
    };
    /**
     * @param {?} uuid
     * @return {?}
     */
    DesignPropsService.prototype.removePropsByUid = function (uuid) {
        var /** @type {?} */ thisIndex;
        this.pageProps.map(function (res, index) {
            if (res.uuid === uuid) {
                thisIndex = index;
            }
        });
        this.pageProps.splice(thisIndex, 1);
        this.updateHistory();
    };
    /**
     * @return {?}
     */
    DesignPropsService.prototype.getHistory = function () {
        var /** @type {?} */ local = localStorage.getItem(this.historyKey);
        if (local) {
            var /** @type {?} */ items = (JSON.parse(local));
            return items;
        }
        else {
            return [];
        }
    };
    /**
     * @return {?}
     */
    DesignPropsService.prototype.updateHistory = function () {
        this.historys.unshift({
            name: new Date().toISOString(),
            data: this.pageProps
        });
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(this.historyKey, JSON.stringify(this.historys));
    };
    /**
     * @param {?=} item
     * @return {?}
     */
    DesignPropsService.prototype.backToHistory = function (item) {
        if (item === void 0) {
            item = null;
        }
        if (!item) {
            item = this.getHistory()[0];
        }
        this.pageProps = item.data;
    };
    return DesignPropsService;
}());
DesignPropsService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DesignPropsService.ctorParameters = function () {
    return [
        { type: undefined, decorators: [{ type: core.Inject, args: [DESIGN_COMPONENTS,] },] },
    ];
};
var DesignLibraryService = (function () {
    /**
     * @param {?} components
     */
    function DesignLibraryService(components) {
        this.components = [];
        this.components = flatten(components);
        console.log('DesignLibraryService', this.components);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    DesignLibraryService.prototype.get = function (name) {
        var /** @type {?} */ com;
        this.components.map(function (item) {
            if (item[name]) {
                com = item[name];
            }
        });
        return com;
    };
    return DesignLibraryService;
}());
DesignLibraryService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DesignLibraryService.ctorParameters = function () {
    return [
        { type: undefined, decorators: [{ type: core.Inject, args: [DESIGN_LIBRARYS,] },] },
    ];
};
var NgComponentDirective = (function () {
    /**
     * @param {?} _viewContainerRef
     * @param {?} _template
     * @param {?} differs
     * @param {?} librarys
     * @param {?} props
     */
    function NgComponentDirective(_viewContainerRef, _template, differs, librarys, props) {
        this._viewContainerRef = _viewContainerRef;
        this._template = _template;
        this.differs = differs;
        this.librarys = librarys;
        this.props = props;
        this.instances = [];
        this.viewContainerRef = _viewContainerRef;
    }
    /**
     * @return {?}
     */
    NgComponentDirective.prototype.ngDoCheck = function () {
        var _this = this;
        if (this._differ) {
            var /** @type {?} */ changes = this._differ.diff(this.ngComponent);
            if (changes) {
                changes.forEachOperation(function (item, adjustedPreviousIndex, currentIndex) {
                    if (item.previousIndex == null) {
                        _this.createComponent(item, currentIndex);
                    }
                    else if (currentIndex == null) {
                        _this._viewContainerRef.remove(adjustedPreviousIndex);
                    }
                    else {
                        var /** @type {?} */ view = ((_this._viewContainerRef.get(adjustedPreviousIndex)));
                        _this._viewContainerRef.move(view, currentIndex);
                    }
                });
            }
        }
    };
    /**
     * @param {?} item
     * @param {?} currentIndex
     * @return {?}
     */
    NgComponentDirective.prototype.createComponent = function (item, currentIndex) {
        var _this = this;
        try {
            var /** @type {?} */ designLibraryProp_1 = item.item;
            if (designLibraryProp_1) {
                var /** @type {?} */ component = void 0;
                var /** @type {?} */ libs = this.librarys.get(designLibraryProp_1.name);
                if (this.ngComponentPreview) {
                    component = libs.view;
                }
                else {
                    component = libs.setting;
                }
                var /** @type {?} */ elInjector = this.viewContainerRef.parentInjector;
                var /** @type {?} */ componentFactoryResolver = this.moduleRef ? this.moduleRef.componentFactoryResolver :
                    elInjector.get(core.ComponentFactoryResolver);
                var /** @type {?} */ componentFactory = componentFactoryResolver.resolveComponentFactory(component);
                var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, currentIndex, elInjector);
                // designLibraryProp.props = JSON.parse(JSON.stringify(designLibraryProp.props));
                if (designLibraryProp_1.props) {
                    componentRef.instance.props = designLibraryProp_1.props;
                }
                if (designLibraryProp_1.state) {
                    componentRef.instance.state = designLibraryProp_1.state;
                }
                componentRef.instance.onClick.subscribe(function (res) {
                    _this.ngComponentClick && _this.ngComponentClick(designLibraryProp_1);
                });
                componentRef.instance.setClass(this.ngComponentClass);
                componentRef.instance.setStyle(this.ngComponentStyle);
                if (this.ngComponentDrag) {
                    this.setDrage(componentRef.instance);
                }
                if (this.ngComponentDrop) {
                    this.setDrop(componentRef.instance);
                }
                designLibraryProp_1.uuid = componentRef.instance.guid;
                var /** @type {?} */ instanceComponent = new InstanceComponent(componentRef.instance.guid, designLibraryProp_1);
                this.instances.push(instanceComponent);
            }
        }
        catch (err) {
            console.log((this.ngComponentPreview ? 'preview' : 'setting') + " is not fond", item);
            console.dir(err);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgComponentDirective.prototype.ngOnChanges = function (changes) {
        this.viewContainerRef.clear();
        if ('ngComponent' in changes) {
            var /** @type {?} */ value = changes['ngComponent'].currentValue;
            if (value && !this._differ) {
                try {
                    this._differ = this.differs.find(value).create();
                }
                catch (err) { }
            }
        }
    };
    /**
     * @param {?} instance
     * @return {?}
     */
    NgComponentDirective.prototype.setDrage = function (instance) {
        instance.setAttribute({
            draggable: true
        });
        var /** @type {?} */ ele = instance.ele.nativeElement;
        var /** @type {?} */ uuid;
        fromEvent.fromEvent(ele, 'dragstart').subscribe(function (ev) {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", instance.guid);
        });
        fromEvent.fromEvent(ele, 'dragleave').subscribe(function (ev) {
            // dragend 删除这一个
        });
        fromEvent.fromEvent(ele, 'dragend').subscribe(function (ev) {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    };
    /**
     * @param {?} instance
     * @return {?}
     */
    NgComponentDirective.prototype.setDrop = function (instance) {
        var _this = this;
        var /** @type {?} */ ele = instance.ele.nativeElement;
        fromEvent.fromEvent(ele, 'drop').subscribe(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var /** @type {?} */ data = ev.dataTransfer.getData("name");
            if (!instance.guid) {
                // 获取props
                var /** @type {?} */ props = _this.props.getPropsByName(data);
                instance.props.children.push(props);
            }
            else if (instance.guid !== data) {
                // 移动已存在props
                var /** @type {?} */ props = _this.getInstanceProps(data);
                if (props) {
                    instance.props.children.push(props);
                }
            }
        });
        fromEvent.fromEvent(ele, 'dragover').subscribe(function (ev) {
            ele.style.bor;
            ev.preventDefault();
            ev.stopPropagation();
        });
    };
    /**
     * @param {?} uuid
     * @return {?}
     */
    NgComponentDirective.prototype.getInstanceProps = function (uuid) {
        var /** @type {?} */ props;
        this.instances.map(function (res) {
            if (res.guid === uuid) {
                props = res.props;
            }
        });
        return props;
    };
    return NgComponentDirective;
}());
NgComponentDirective.decorators = [
    { type: core.Directive, args: [{ selector: '[ngComponent]' },] },
];
/**
 * @nocollapse
 */
NgComponentDirective.ctorParameters = function () {
    return [
        { type: core.ViewContainerRef, },
        { type: core.TemplateRef, },
        { type: core.IterableDiffers, },
        { type: DesignLibraryService, },
        { type: DesignPropsService, },
    ];
};
NgComponentDirective.propDecorators = {
    'ngComponent': [{ type: core.Input },],
    'ngComponentPreview': [{ type: core.Input },],
    'ngComponentState': [{ type: core.Input },],
    'ngComponentClass': [{ type: core.Input },],
    'ngComponentStyle': [{ type: core.Input },],
    'ngComponentDrag': [{ type: core.Input },],
    'ngComponentDrop': [{ type: core.Input },],
    'ngComponentClick': [{ type: core.Input },],
};
var InstanceComponent = (function () {
    /**
     * @param {?} guid
     * @param {?} props
     */
    function InstanceComponent(guid, props) {
        this.guid = guid;
        this.props = props;
    }
    return InstanceComponent;
}());
var IDesignComponentModule = (function () {
    function IDesignComponentModule() {
    }
    /**
     * @param {?} coms
     * @return {?}
     */
    IDesignComponentModule.forRoot = function (coms) {
        return {
            ngModule: IDesignComponentModule,
            providers: [{
                    provide: DESIGN_LIBRARYS,
                    useValue: coms,
                    multi: true
                }]
        };
    };
    return IDesignComponentModule;
}());
IDesignComponentModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [],
                exports: [
                    NgComponentDirective
                ],
                declarations: [
                    NgComponentDirective
                ],
                providers: [
                    DesignApiService,
                    DesignLibraryService,
                    DesignPropsService
                ],
            },] },
];
/**
 * @nocollapse
 */
IDesignComponentModule.ctorParameters = function () { return []; };
/**
 * @param {?} obj
 * @return {?}
 */
var DesignSettingComponent = (function () {
    function DesignSettingComponent() {
        this._setting = true;
    }
    /**
     * @return {?}
     */
    DesignSettingComponent.prototype.ngOnInit = function () { };
    /**
     * @param {?} com
     * @return {?}
     */
    DesignSettingComponent.prototype.setSetting = function (com) {
        this.item = com;
    };
    return DesignSettingComponent;
}());
DesignSettingComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design-setting',
                template: "\n\n      <ng-container *ngComponent=\"[item]\"></ng-container>\n\n      <div class=\"meepo-design-setting-empty\" *ngIf=\"!item\">\n          \u8BF7\u9009\u62E9\u8981\u7F16\u8F91\u7684\u9875\u9762\u5143\u7D20\n      </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
DesignSettingComponent.ctorParameters = function () { return []; };
DesignSettingComponent.propDecorators = {
    '_setting': [{ type: core.HostBinding, args: ['class.meepo-design-setting',] },],
};
var DesignPreviewComponent = (function () {
    /**
     * @param {?} props
     */
    function DesignPreviewComponent(props) {
        var _this = this;
        this.props = props;
        this._preview = true;
        this.doClick = new core.EventEmitter();
        this.directives = {
            name: 'device-iphone-8 device-gold',
            color: '',
            src: './assets/img/bg-03.jpg',
            type: 'image'
        };
        this.onClick = function (e) {
            _this.doClick.emit(e);
        };
        this.isOpen = false;
    }
    /**
     * @return {?}
     */
    DesignPreviewComponent.prototype.ngOnInit = function () { };
    /**
     * @param {?} e
     * @return {?}
     */
    DesignPreviewComponent.prototype._showMore = function (e) {
        console.log('显示操作提示');
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPreviewComponent.prototype.addComponent = function (name) {
        this.props.addPropByName(name);
    };
    /**
     * @param {?} uuid
     * @return {?}
     */
    DesignPreviewComponent.prototype.removeComponent = function (uuid) {
        this.props.removePropsByUid(uuid);
    };
    return DesignPreviewComponent;
}());
DesignPreviewComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design-preview',
                template: "\n      <div class=\"meepo-design-preview-deletor\">\n          \u5783\u573E\u6876\uFF0C\u5C06\u5E9F\u5F03\u7EC4\u4EF6\u62D6\u5165\u6B64\u95F4\uFF01\n      </div>\n      <div class=\"device device-iphone-8\" [ngClass]=\"directives.name\">\n          <div class=\"device-frame\">\n              <div class=\"meepo-design-preview-container device-content\" canDrop (canDropChange)=\"addComponent($event)\">\n                  <ng-container *ngComponent=\"\n                      props.pageProps;\n                      preview: true;\n                      click: onClick;\n                      class: {'editing':true};\n                      drag: true;\n                      drop: true;\n                  \"></ng-container>\n              </div>\n          </div>\n          <div class=\"device-stripe\"></div>\n          <div class=\"device-header\"></div>\n          <div class=\"device-sensors\"></div>\n          <div class=\"device-btns\"></div>\n          <div class=\"device-power\"></div>\n          <div class=\"device-home\"></div>\n      </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
DesignPreviewComponent.ctorParameters = function () { return [
    { type: DesignPropsService, },
]; };
DesignPreviewComponent.propDecorators = {
    '_preview': [{ type: core.HostBinding, args: ['class.meepo-design-preview',] },],
    'doClick': [{ type: core.Output },],
};
var DesignLibraryComponent = (function () {
    /**
     * @param {?} props
     */
    function DesignLibraryComponent(props) {
        this.props = props;
        this._library = true;
        this.components = [];
    }
    /**
     * @return {?}
     */
    DesignLibraryComponent.prototype.ngOnInit = function () {
        this.components = this.props.props;
    };
    return DesignLibraryComponent;
}());
DesignLibraryComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design-library',
                template: "\n      <ng-container *ngFor=\"let item of components\">\n          <div class=\"grid-item\" [canDrag]=\"item.name\">\n              <span>{{item.title}}</span>\n          </div>\n      </ng-container>\n      <div style=\"clear: both;\"></div>\n      <div style=\"height:88px;\"></div>\n    "
            },] },
];
/**
 * @nocollapse
 */
DesignLibraryComponent.ctorParameters = function () { return [
    { type: DesignPropsService, },
]; };
DesignLibraryComponent.propDecorators = {
    '_library': [{ type: core.HostBinding, args: ['class.meepo-design-library',] },],
};
var DesignHistoryComponent = (function () {
    /**
     * @param {?} props
     */
    function DesignHistoryComponent(props) {
        this.props = props;
        this._history = true;
    }
    /**
     * @return {?}
     */
    DesignHistoryComponent.prototype.ngOnInit = function () { };
    /**
     * @return {?}
     */
    DesignHistoryComponent.prototype.getLocal = function () {
        return this.props.getHistory();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    DesignHistoryComponent.prototype.backToHistory = function (item) {
        this.props.backToHistory(item);
    };
    return DesignHistoryComponent;
}());
DesignHistoryComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design-history',
                template: "\n      <ul>\n          <li  (click)=\"backToHistory(item)\" *ngFor=\"let item of props.historys\">{{item.name}}</li>\n      </ul>\n    "
            },] },
];
/**
 * @nocollapse
 */
DesignHistoryComponent.ctorParameters = function () { return [
    { type: DesignPropsService, },
]; };
DesignHistoryComponent.propDecorators = {
    '_history': [{ type: core.HostBinding, args: ['class.meepo-design-history',] },],
};
var DESIGN_PAGES = new core.InjectionToken('DESIGN_PAGES');
var DesignPagesComponent = (function () {
    /**
     * @param {?} pages
     */
    function DesignPagesComponent(pages) {
        this.pages = [];
        this.pages = pages;
    }
    /**
     * @return {?}
     */
    DesignPagesComponent.prototype.ngOnInit = function () { };
    return DesignPagesComponent;
}());
DesignPagesComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design-pages',
                template: "\n      <ul>\n          <li *ngFor=\"let page of pages\">\n              {{page.title}}\n          </li>\n      </ul>\n    "
            },] },
];
/**
 * @nocollapse
 */
DesignPagesComponent.ctorParameters = function () { return [
    { type: Array, decorators: [{ type: core.Inject, args: [DESIGN_PAGES,] },] },
]; };
var DesignComponent = (function () {
    /**
     * @param {?} props
     * @param {?} router
     */
    function DesignComponent(props, router$$1) {
        this.props = props;
        this.router = router$$1;
        this._design = true;
        this.activeHistory = false;
    }
    /**
     * @return {?}
     */
    DesignComponent.prototype.ngOnInit = function () {
    };
    /**
     * @param {?} com
     * @return {?}
     */
    DesignComponent.prototype.setSetting = function (com) {
        this._setting.setSetting(com);
    };
    /**
     * @return {?}
     */
    DesignComponent.prototype.saveToHistory = function () {
        this.props.updateHistory();
    };
    /**
     * @return {?}
     */
    DesignComponent.prototype.previewToHistory = function () {
        this.router.navigate(['preview']);
    };
    /**
     * @return {?}
     */
    DesignComponent.prototype.postToHistory = function () { };
    return DesignComponent;
}());
DesignComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'design',
                template: "\n      <div class=\"meepo-design-left\">\n          <ul class=\"meepo-design-left-header\">\n              <li [class.active]=\"activeHistory\" (click)=\"activeHistory = true\">\u5386\u53F2\u8BB0\u5F55</li>\n              <li [class.active]=\"!activeHistory\" (click)=\"activeHistory = false\">\u9875\u9762\u7BA1\u7406</li>\n          </ul>\n          <div class=\"meepo-design-left-container\">\n              <design-history *ngIf=\"activeHistory\"></design-history>\n              <design-pages *ngIf=\"!activeHistory\"></design-pages>\n          </div>\n      </div>\n      <design-library></design-library>\n      <design-preview (doClick)=\"setSetting($event)\"></design-preview>\n      <design-setting></design-setting>\n\n      <div class=\"meepo-design-footer\">\n          <a href=\"javascript:;\" (click)=\"saveToHistory()\" class=\"meepo-design-footer-save\">\u4FDD\u5B58</a>\n          <a href=\"javascript:;\" (click)=\"previewToHistory()\" class=\"meepo-design-footer-preview\">\u9884\u89C8</a>\n          <a href=\"javascript:;\" (click)=\"postToHistory()\" class=\"meepo-design-footer-post\">\u751F\u6210</a>\n      </div>\n    ",
                styles: ["\n      .meepo-design {\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        height: 100%;\n        width: 100%; }\n        .meepo-design .editing {\n          cursor: pointer; }\n        .meepo-design-history, .meepo-design-library, .meepo-design-preview, .meepo-design-setting, .meepo-design-pages {\n          min-height: 80px;\n          position: relative; }\n        .meepo-design-left-container {\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-orient: vertical;\n          -webkit-box-direction: normal;\n              -ms-flex-direction: column;\n                  flex-direction: column;\n          height: calc(100% - 44px);\n          overflow: auto;\n          width: 250px;\n          background: #efefef; }\n        .meepo-design-left-header {\n          list-style: none;\n          margin: 0px;\n          padding: 0px;\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-orient: horizontal;\n          -webkit-box-direction: normal;\n              -ms-flex-direction: row;\n                  flex-direction: row; }\n          .meepo-design-left-header li {\n            text-align: center;\n            -webkit-box-flex: 1;\n                -ms-flex: 1;\n                    flex: 1;\n            height: 44px;\n            line-height: 44px;\n            margin: 0px; }\n            .meepo-design-left-header li.active {\n              background: #db4804;\n              color: #fff; }\n        .meepo-design-pages {\n          display: block;\n          background: #efefef;\n          width: 250px;\n          max-height: 100%;\n          overflow: auto; }\n        .meepo-design-history {\n          display: block;\n          background: #efefef;\n          width: 250px;\n          max-height: 100%;\n          overflow: auto; }\n          .meepo-design-history ul {\n            list-style: none;\n            margin: 0px;\n            padding: 0px; }\n            .meepo-design-history ul li {\n              line-height: 30px;\n              background: #efefef;\n              cursor: pointer; }\n              .meepo-design-history ul li:hover {\n                opacity: .8;\n                background: #fff; }\n        .meepo-design-library {\n          background: white;\n          width: 200px;\n          display: block;\n          overflow: auto; }\n          .meepo-design-library:after {\n            clear: both;\n            content: \" \"; }\n          .meepo-design-library .grid-item {\n            float: left;\n            width: 50%;\n            text-align: center;\n            line-height: 44px;\n            background: #efefef;\n            border: 1px solid #fff;\n            cursor: pointer; }\n            .meepo-design-library .grid-item:hover {\n              background: #ccc; }\n        .meepo-design-preview {\n          display: block;\n          background: #f3f3f3;\n          width: 400px;\n          max-height: 100%;\n          overflow: auto; }\n          .meepo-design-preview .device {\n            margin: 0 auto; }\n          .meepo-design-preview-deletor {\n            height: 120px;\n            display: -webkit-box;\n            display: -ms-flexbox;\n            display: flex;\n            -webkit-box-orient: horizontal;\n            -webkit-box-direction: normal;\n                -ms-flex-direction: row;\n                    flex-direction: row;\n            -webkit-box-pack: center;\n                -ms-flex-pack: center;\n                    justify-content: center;\n            -webkit-box-align: center;\n                -ms-flex-align: center;\n                    align-items: center;\n            background: gray;\n            color: #fff;\n            margin-bottom: 10px;\n            margin-left: 10px;\n            margin-right: 10px; }\n          .meepo-design-preview-iphone {\n            margin: 0 auto; }\n          .meepo-design-preview-container {\n            height: 100%;\n            position: absolute;\n            top: 0px;\n            left: 0px;\n            right: 0px;\n            bottom: 0px; }\n          .meepo-design-preview .device-content {\n            overflow: auto;\n            width: 100%;\n            height: 100%; }\n        .meepo-design-setting {\n          display: block;\n          background: #efefef;\n          -webkit-box-flex: 1;\n              -ms-flex: 1;\n                  flex: 1;\n          padding: 0 10px;\n          border-left: 10px solid #fff; }\n          .meepo-design-setting-empty {\n            height: 100%;\n            display: -webkit-box;\n            display: -ms-flexbox;\n            display: flex;\n            -webkit-box-orient: vertical;\n            -webkit-box-direction: normal;\n                -ms-flex-direction: column;\n                    flex-direction: column;\n            -webkit-box-pack: center;\n                -ms-flex-pack: center;\n                    justify-content: center;\n            -webkit-box-align: center;\n                -ms-flex-align: center;\n                    align-items: center;\n            font-size: .8em;\n            color: gray; }\n        .meepo-design-footer {\n          position: fixed;\n          bottom: 0px;\n          left: 0px;\n          right: 0px;\n          height: 60px;\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-orient: horizontal;\n          -webkit-box-direction: normal;\n              -ms-flex-direction: row;\n                  flex-direction: row;\n          -webkit-box-pack: end;\n              -ms-flex-pack: end;\n                  justify-content: flex-end;\n          -webkit-box-align: center;\n              -ms-flex-align: center;\n                  align-items: center;\n          background: rgba(0, 0, 0, 0.5); }\n          .meepo-design-footer-save, .meepo-design-footer-preview, .meepo-design-footer-post {\n            width: 8em;\n            text-align: center;\n            height: 100%;\n            line-height: 60px; }\n          .meepo-design-footer-save {\n            background: #c74a06; }\n          .meepo-design-footer-preview {\n            background: #004fbf; }\n          .meepo-design-footer-post {\n            background: #0d7355; }\n          .meepo-design-footer a {\n            text-decoration: none;\n            color: #fff; }\n            .meepo-design-footer a:hover {\n              text-decoration: none; }\n    "],
                encapsulation: core.ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
DesignComponent.ctorParameters = function () { return [
    { type: DesignPropsService, },
    { type: router.Router, },
]; };
DesignComponent.propDecorators = {
    '_design': [{ type: core.HostBinding, args: ['class.meepo-design',] },],
    '_setting': [{ type: core.ViewChild, args: [DesignSettingComponent,] },],
    '_library': [{ type: core.ViewChild, args: [DesignLibraryComponent,] },],
    '_preview': [{ type: core.ViewChild, args: [DesignPreviewComponent,] },],
    '_history': [{ type: core.ViewChild, args: [DesignHistoryComponent,] },],
    '_pages': [{ type: core.ViewChild, args: [DesignPagesComponent,] },],
};
var CanDropDirective = (function () {
    /**
     * @param {?} ele
     * @param {?} render
     */
    function CanDropDirective(ele, render) {
        this.ele = ele;
        this.render = render;
        this.canDropChange = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    CanDropDirective.prototype.ngOnInit = function () {
        var _this = this;
        fromEvent.fromEvent(this.ele.nativeElement, 'drop').subscribe(function (ev) {
            ev.preventDefault();
            var /** @type {?} */ data = ev.dataTransfer.getData("name");
            _this.canDropChange.emit(data);
        });
        fromEvent.fromEvent(this.ele.nativeElement, 'dragover').subscribe(function (ev) {
            ev.preventDefault();
        });
    };
    return CanDropDirective;
}());
CanDropDirective.decorators = [
    { type: core.Directive, args: [{ selector: '[canDrop]' },] },
];
/**
 * @nocollapse
 */
CanDropDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: core.Renderer2, },
]; };
CanDropDirective.propDecorators = {
    'canDropChange': [{ type: core.Output },],
    'canDrop': [{ type: core.Input },],
};
var CanDragDirective = (function () {
    /**
     * @param {?} ele
     * @param {?} render
     * @param {?} view
     */
    function CanDragDirective(ele, render, view) {
        this.ele = ele;
        this.render = render;
        this.view = view;
        this._drop = true;
        this.canDragChange = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    CanDragDirective.prototype.ngOnInit = function () {
        var _this = this;
        fromEvent.fromEvent(this.ele.nativeElement, 'dragstart').subscribe(function (ev) {
            ev.dataTransfer.setData("name", _this.canDrag);
        });
        fromEvent.fromEvent(this.ele.nativeElement, 'dragend').subscribe(function (res) {
            _this.canDragChange.emit(_this.canDrag);
        });
    };
    return CanDragDirective;
}());
CanDragDirective.decorators = [
    { type: core.Directive, args: [{ selector: '[canDrag]' },] },
];
/**
 * @nocollapse
 */
CanDragDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: core.Renderer2, },
    { type: core.ViewContainerRef, },
]; };
CanDragDirective.propDecorators = {
    '_drop': [{ type: core.HostBinding, args: ['attr.draggable',] },],
    'canDrag': [{ type: core.Input },],
    'canDragChange': [{ type: core.Output },],
};
var IDesignModule = (function () {
    function IDesignModule() {
    }
    /**
     * @param {?=} pages
     * @return {?}
     */
    IDesignModule.forRoot = function (pages) {
        if (pages === void 0) { pages = []; }
        return {
            ngModule: IDesignModule,
            providers: [{
                    provide: DESIGN_PAGES,
                    useValue: pages
                }]
        };
    };
    return IDesignModule;
}());
IDesignModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    router.RouterModule.forChild([{
                            path: 'design',
                            component: DesignComponent
                        }]),
                    IDesignComponentModule.forRoot([])
                ],
                exports: [
                    DesignLibraryComponent, DesignComponent,
                    DesignHistoryComponent, DesignPreviewComponent,
                    DesignSettingComponent, CanDropDirective, CanDragDirective,
                    DesignPagesComponent
                ],
                declarations: [
                    DesignLibraryComponent, DesignComponent,
                    DesignHistoryComponent, DesignPreviewComponent,
                    DesignSettingComponent, CanDropDirective, CanDragDirective,
                    DesignPagesComponent,
                ],
                providers: [],
            },] },
];
/**
 * @nocollapse
 */
IDesignModule.ctorParameters = function () { return []; };

exports.IDesignModule = IDesignModule;
exports.ɵe = DESIGN_PAGES;
exports.ɵg = DesignComponent;
exports.ɵd = DesignHistoryComponent;
exports.ɵc = DesignLibraryComponent;
exports.ɵf = DesignPagesComponent;
exports.ɵb = DesignPreviewComponent;
exports.ɵa = DesignSettingComponent;
exports.ɵi = CanDragDirective;
exports.ɵh = CanDropDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=meepo-idesign.umd.js.map
