import { Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostBinding, Inject, Injectable, InjectionToken, Injector, Input, IterableDiffers, NgModule, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { fromEvent as fromEvent$1 } from 'rxjs/observable/fromEvent';
import { Subject as Subject$1 } from 'rxjs/Subject';

/**
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
var DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
var DesignLibraryService = (function () {
    /**
     * @param {?} components
     */
    function DesignLibraryService(components) {
        this.components = [];
        this.components = flatten(components);
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
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignLibraryService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DESIGN_LIBRARYS,] },] },
]; };
var NgComponentDirective = (function () {
    /**
     * @param {?} _viewContainerRef
     * @param {?} _template
     * @param {?} differs
     * @param {?} librarys
     */
    function NgComponentDirective(_viewContainerRef, _template, differs, librarys) {
        this._viewContainerRef = _viewContainerRef;
        this._template = _template;
        this.differs = differs;
        this.librarys = librarys;
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
                elInjector.get(ComponentFactoryResolver);
            var /** @type {?} */ componentFactory = componentFactoryResolver.resolveComponentFactory(component);
            var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, currentIndex, elInjector);
            // designLibraryProp.props = JSON.parse(JSON.stringify(designLibraryProp.props));
            componentRef.instance.props = designLibraryProp_1.props;
            componentRef.instance.onClick.subscribe(function (res) {
                _this.ngComponentClick && _this.ngComponentClick(designLibraryProp_1);
            });
            componentRef.instance.setClass(this.ngComponentClass);
            componentRef.instance.setStyle(this.ngComponentStyle);
            this.setDrage(componentRef.instance);
            this.setDrop(componentRef.instance);
            designLibraryProp_1.uuid = componentRef.instance.guid;
            var /** @type {?} */ instanceComponent = new InstanceComponent(componentRef.instance.guid, designLibraryProp_1);
            this.instances.push(instanceComponent);
        }
        catch (err) { }
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
        fromEvent$1(ele, 'dragstart').subscribe(function (ev) {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", instance.guid);
        });
        fromEvent$1(ele, 'dragleave').subscribe(function (ev) {
            // dragend 删除这一个
        });
        fromEvent$1(ele, 'dragend').subscribe(function (ev) {
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
        fromEvent$1(ele, 'drop').subscribe(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var /** @type {?} */ data = ev.dataTransfer.getData("name");
            if (instance.guid !== data) {
                // 自己放置自己 忽略 否则提示是放入内部还是互换位置
                var /** @type {?} */ props = _this.getInstanceProps(data);
                if (props) {
                    instance.props.children.push(props);
                }
            }
        });
        fromEvent$1(ele, 'dragover').subscribe(function (ev) {
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
    { type: Directive, args: [{ selector: '[ngComponent]' },] },
];
/**
 * @nocollapse
 */
NgComponentDirective.ctorParameters = function () { return [
    { type: ViewContainerRef, },
    { type: TemplateRef, },
    { type: IterableDiffers, },
    { type: DesignLibraryService, },
]; };
NgComponentDirective.propDecorators = {
    'ngComponent': [{ type: Input },],
    'ngComponentPreview': [{ type: Input },],
    'ngComponentState': [{ type: Input },],
    'ngComponentClass': [{ type: Input },],
    'ngComponentStyle': [{ type: Input },],
    'ngComponentDrag': [{ type: Input },],
    'ngComponentDrop': [{ type: Input },],
    'ngComponentClick': [{ type: Input },],
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
    return IDesignComponentModule;
}());
IDesignComponentModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                exports: [
                    NgComponentDirective
                ],
                declarations: [
                    NgComponentDirective
                ],
                providers: [],
            },] },
];
/**
 * @nocollapse
 */
IDesignComponentModule.ctorParameters = function () { return []; };

const historyKey = 'historyKey';
const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
/**
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten$1(arr) {
    return Array.prototype.concat.apply([], arr);
}
class DesignService {
    /**
     * @param {?} injector
     * @param {?} _allcomponents
     * @param {?} library
     */
    constructor(injector, _allcomponents, library) {
        this.injector = injector;
        this.library = library;
        this._historys = [];
        this.history$ = new Subject$1();
        this.data = [];
        this.data$ = new Subject$1();
        this.allComponents = [];
        this.previewComponents = [];
        this.previewComponents$ = new Subject$1();
        this.allComponents = flatten$1(_allcomponents);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set historys(val) {
        this._historys = val;
    }
    /**
     * @return {?}
     */
    get historys() {
        return this._historys || [];
    }
    /**
     * @param {?} uuid
     * @return {?}
     */
    removeComponentByUuid(uuid) {
        let /** @type {?} */ thisIndex;
        this.previewComponents.map((res, index) => {
            if (res.uuid === uuid) {
                thisIndex = index;
            }
        });
        this.previewComponents.splice(thisIndex, 1);
        this.previewComponents$.next(this.previewComponents);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getComponentByName(name) {
        let /** @type {?} */ com;
        this.allComponents.forEach((item) => {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    }
    /**
     * @return {?}
     */
    getHistory() {
        let /** @type {?} */ local = localStorage.getItem(historyKey);
        if (local) {
            const /** @type {?} */ items = (JSON.parse(local));
            return items;
        }
        else {
            return [];
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    updateHistory(data) {
        this.historys = data;
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(historyKey, JSON.stringify(this.historys));
        this.history$.next(this.historys);
    }
    /**
     * @param {?=} item
     * @return {?}
     */
    backToHistory(item = null) {
        if (!item) {
            item = this.getHistory()[0];
        }
        this.data = item.data;
        this.data$.next(this.data);
    }
}
DesignService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignService.ctorParameters = () => [
    { type: Injector, },
    { type: undefined, decorators: [{ type: Inject, args: [DESIGN_COMPONENTS,] },] },
    { type: DesignLibraryService, },
];

/**
 * @param {?} obj
 * @return {?}
 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
class DesignSettingComponent {
    constructor() {
        this._setting = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() { }
    /**
     * @param {?} com
     * @return {?}
     */
    setSetting(com) {
        this.item = com;
    }
}
DesignSettingComponent.decorators = [
    { type: Component, args: [{
                selector: 'design-setting',
                template: `

      <ng-container *ngComponent="[item]"></ng-container>

      <div class="meepo-design-setting-empty" *ngIf="!item">
          请选择要编辑的页面元素
      </div>
    `
            },] },
];
/**
 * @nocollapse
 */
DesignSettingComponent.ctorParameters = () => [];
DesignSettingComponent.propDecorators = {
    '_setting': [{ type: HostBinding, args: ['class.meepo-design-setting',] },],
};
class DesignPreviewComponent {
    /**
     * @param {?} history
     */
    constructor(history) {
        this.history = history;
        this._preview = true;
        this.doClick = new EventEmitter();
        this.components = [];
        this.directives = {
            name: 'device-iphone-8 device-gold',
            color: '',
            src: './assets/img/bg-03.jpg',
            type: 'image'
        };
        this.onClick = (e) => {
            this.doClick.emit(e);
        };
        this.isOpen = false;
        this.history.data$.subscribe(res => {
            this.components = res;
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // 最后一次操作
        try {
            this.history.backToHistory();
            this.historys = this.history.historys;
        }
        catch (err) {
            localStorage.clear();
        }
        this.history.previewComponents = this.components;
        this.history.previewComponents$.subscribe(res => {
            console.log(res);
            this.components = res;
        });
    }
    /**
     * @param {?} e
     * @return {?}
     */
    _showMore(e) {
        console.log('显示操作提示');
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addComponent(name) {
        try {
            const /** @type {?} */ com = this.history.getComponentByName(name);
            if (com) {
                this.components.push(deepCopy(com));
                this.updateCache();
            }
        }
        catch (err) {
            console.log('undefined err', err);
        }
    }
    /**
     * @param {?} uuid
     * @return {?}
     */
    removeComponent(uuid) {
        let /** @type {?} */ idx = 0;
        this.components.map((com, index) => {
            if (com.uuid === uuid) {
                idx = index;
            }
        });
        this.components.splice(idx, 1);
        this.updateCache();
    }
    /**
     * @return {?}
     */
    updateCache() {
        const /** @type {?} */ now = new Date();
        const /** @type {?} */ components = JSON.stringify(this.components);
        const /** @type {?} */ history = {
            name: now.toISOString(),
            data: JSON.parse(components)
        };
        this.historys = this.historys || [];
        this.historys.unshift(history);
        this.history.updateHistory(this.historys);
    }
}
DesignPreviewComponent.decorators = [
    { type: Component, args: [{
                selector: 'design-preview',
                template: `
      <div class="meepo-design-preview-deletor">
          垃圾桶，将废弃组件拖入此间！
      </div>
      <div class="device device-iphone-8" [ngClass]="directives.name">
          <div class="device-frame">
              <div class="meepo-design-preview-container device-content" canDrop (canDropChange)="addComponent($event)">
                  <ng-container *ngComponent="components;preview: true;click: onClick;class: {'editing':true}"></ng-container>
              </div>
          </div>
          <div class="device-stripe"></div>
          <div class="device-header"></div>
          <div class="device-sensors"></div>
          <div class="device-btns"></div>
          <div class="device-power"></div>
          <div class="device-home"></div>
      </div>
    `
            },] },
];
/**
 * @nocollapse
 */
DesignPreviewComponent.ctorParameters = () => [
    { type: DesignService, },
];
DesignPreviewComponent.propDecorators = {
    '_preview': [{ type: HostBinding, args: ['class.meepo-design-preview',] },],
    'doClick': [{ type: Output },],
};
class DesignLibraryComponent {
    /**
     * @param {?} history
     */
    constructor(history) {
        this.history = history;
        this._library = true;
        this.components = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.components = this.history.allComponents;
    }
}
DesignLibraryComponent.decorators = [
    { type: Component, args: [{
                selector: 'design-library',
                template: `
      <ng-container *ngFor="let item of components">
          <div class="grid-item" [canDrag]="item.name">
              <span>{{item.title}}</span>
          </div>
      </ng-container>
      <div style="clear: both;"></div>
      <div style="height:88px;"></div>
    `
            },] },
];
/**
 * @nocollapse
 */
DesignLibraryComponent.ctorParameters = () => [
    { type: DesignService, },
];
DesignLibraryComponent.propDecorators = {
    '_library': [{ type: HostBinding, args: ['class.meepo-design-library',] },],
};
class DesignHistoryComponent {
    /**
     * @param {?} history
     */
    constructor(history) {
        this.history = history;
        this._history = true;
        this.items = [];
        this.items = this.getLocal();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.history.history$.subscribe(res => {
            this.items = res;
        });
    }
    /**
     * @return {?}
     */
    getLocal() {
        return this.history.getHistory();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    backToHistory(item) {
        this.history.backToHistory(item);
    }
}
DesignHistoryComponent.decorators = [
    { type: Component, args: [{
                selector: 'design-history',
                template: `
      <ul>
          <li  (click)="backToHistory(item)" *ngFor="let item of items">{{item.name}}</li>
      </ul>
    `
            },] },
];
/**
 * @nocollapse
 */
DesignHistoryComponent.ctorParameters = () => [
    { type: DesignService, },
];
DesignHistoryComponent.propDecorators = {
    '_history': [{ type: HostBinding, args: ['class.meepo-design-history',] },],
};
const DESIGN_PAGES = new InjectionToken('DESIGN_PAGES');
class DesignPagesComponent {
    /**
     * @param {?} pages
     */
    constructor(pages) {
        this.pages = [];
        this.pages = pages;
    }
    /**
     * @return {?}
     */
    ngOnInit() { }
}
DesignPagesComponent.decorators = [
    { type: Component, args: [{
                selector: 'design-pages',
                template: `
      <ul>
          <li *ngFor="let page of pages">
              {{page.title}}
          </li>
      </ul>
    `
            },] },
];
/**
 * @nocollapse
 */
DesignPagesComponent.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [DESIGN_PAGES,] },] },
];
class DesignComponent {
    /**
     * @param {?} history
     * @param {?} router
     */
    constructor(history, router$$1) {
        this.history = history;
        this.router = router$$1;
        this._design = true;
        this.activeHistory = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} com
     * @return {?}
     */
    setSetting(com) {
        this._setting.setSetting(com);
    }
    /**
     * @return {?}
     */
    saveToHistory() {
        this._preview.updateCache();
    }
    /**
     * @return {?}
     */
    previewToHistory() {
        this.router.navigate(['preview']);
    }
    /**
     * @return {?}
     */
    postToHistory() { }
}
DesignComponent.decorators = [
    { type: Component, args: [{
                selector: 'design',
                template: `
      <div class="meepo-design-left">
          <ul class="meepo-design-left-header">
              <li [class.active]="activeHistory" (click)="activeHistory = true">历史记录</li>
              <li [class.active]="!activeHistory" (click)="activeHistory = false">页面管理</li>
          </ul>
          <div class="meepo-design-left-container">
              <design-history *ngIf="activeHistory"></design-history>
              <design-pages *ngIf="!activeHistory"></design-pages>
          </div>
      </div>
      <!-- <design-library></design-library> -->
      <design-preview (doClick)="setSetting($event)"></design-preview>
      <design-setting></design-setting>

      <div class="meepo-design-footer">
          <a href="javascript:;" (click)="saveToHistory()" class="meepo-design-footer-save">保存</a>
          <a href="javascript:;" (click)="previewToHistory()" class="meepo-design-footer-preview">预览</a>
          <a href="javascript:;" (click)="postToHistory()" class="meepo-design-footer-post">生成</a>
      </div>
    `,
                styles: [`
      .meepo-design {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        height: 100%;
        width: 100%; }
        .meepo-design .editing {
          cursor: pointer; }
        .meepo-design-history, .meepo-design-library, .meepo-design-preview, .meepo-design-setting, .meepo-design-pages {
          min-height: 80px;
          position: relative; }
        .meepo-design-left-container {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
              -ms-flex-direction: column;
                  flex-direction: column;
          height: calc(100% - 44px);
          overflow: auto;
          width: 250px;
          background: #efefef; }
        .meepo-design-left-header {
          list-style: none;
          margin: 0px;
          padding: 0px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
              -ms-flex-direction: row;
                  flex-direction: row; }
          .meepo-design-left-header li {
            text-align: center;
            -webkit-box-flex: 1;
                -ms-flex: 1;
                    flex: 1;
            height: 44px;
            line-height: 44px;
            margin: 0px; }
            .meepo-design-left-header li.active {
              background: #db4804;
              color: #fff; }
        .meepo-design-pages {
          display: block;
          background: #efefef;
          width: 250px;
          max-height: 100%;
          overflow: auto; }
        .meepo-design-history {
          display: block;
          background: #efefef;
          width: 250px;
          max-height: 100%;
          overflow: auto; }
          .meepo-design-history ul {
            list-style: none;
            margin: 0px;
            padding: 0px; }
            .meepo-design-history ul li {
              line-height: 30px;
              background: #efefef;
              cursor: pointer; }
              .meepo-design-history ul li:hover {
                opacity: .8;
                background: #fff; }
        .meepo-design-library {
          background: white;
          width: 200px;
          display: block;
          overflow: auto; }
          .meepo-design-library:after {
            clear: both;
            content: " "; }
          .meepo-design-library .grid-item {
            float: left;
            width: 50%;
            text-align: center;
            line-height: 44px;
            background: #efefef;
            border: 1px solid #fff;
            cursor: pointer; }
            .meepo-design-library .grid-item:hover {
              background: #ccc; }
        .meepo-design-preview {
          display: block;
          background: #f3f3f3;
          width: 400px;
          max-height: 100%;
          overflow: auto; }
          .meepo-design-preview .device {
            margin: 0 auto; }
          .meepo-design-preview-deletor {
            height: 120px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
                -ms-flex-direction: row;
                    flex-direction: row;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            background: gray;
            color: #fff;
            margin-bottom: 10px;
            margin-left: 10px;
            margin-right: 10px; }
          .meepo-design-preview-iphone {
            margin: 0 auto; }
          .meepo-design-preview-container {
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px; }
          .meepo-design-preview .device-content {
            overflow: auto;
            width: 100%;
            height: 100%; }
        .meepo-design-setting {
          display: block;
          background: #efefef;
          -webkit-box-flex: 1;
              -ms-flex: 1;
                  flex: 1;
          padding: 0 10px;
          border-left: 10px solid #fff; }
          .meepo-design-setting-empty {
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            font-size: .8em;
            color: gray; }
        .meepo-design-footer {
          position: fixed;
          bottom: 0px;
          left: 0px;
          right: 0px;
          height: 60px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
              -ms-flex-direction: row;
                  flex-direction: row;
          -webkit-box-pack: end;
              -ms-flex-pack: end;
                  justify-content: flex-end;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
          background: rgba(0, 0, 0, 0.5); }
          .meepo-design-footer-save, .meepo-design-footer-preview, .meepo-design-footer-post {
            width: 8em;
            text-align: center;
            height: 100%;
            line-height: 60px; }
          .meepo-design-footer-save {
            background: #c74a06; }
          .meepo-design-footer-preview {
            background: #004fbf; }
          .meepo-design-footer-post {
            background: #0d7355; }
          .meepo-design-footer a {
            text-decoration: none;
            color: #fff; }
            .meepo-design-footer a:hover {
              text-decoration: none; }
    `],
                encapsulation: ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
DesignComponent.ctorParameters = () => [
    { type: DesignService, },
    { type: Router, },
];
DesignComponent.propDecorators = {
    '_design': [{ type: HostBinding, args: ['class.meepo-design',] },],
    '_setting': [{ type: ViewChild, args: [DesignSettingComponent,] },],
    '_library': [{ type: ViewChild, args: [DesignLibraryComponent,] },],
    '_preview': [{ type: ViewChild, args: [DesignPreviewComponent,] },],
    '_history': [{ type: ViewChild, args: [DesignHistoryComponent,] },],
    '_pages': [{ type: ViewChild, args: [DesignPagesComponent,] },],
};

class CanDropDirective {
    /**
     * @param {?} ele
     * @param {?} render
     */
    constructor(ele, render) {
        this.ele = ele;
        this.render = render;
        this.canDropChange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        fromEvent$1(this.ele.nativeElement, 'drop').subscribe((ev) => {
            ev.preventDefault();
            var /** @type {?} */ data = ev.dataTransfer.getData("name");
            this.canDropChange.emit(data);
        });
        fromEvent$1(this.ele.nativeElement, 'dragover').subscribe((ev) => {
            ev.preventDefault();
        });
    }
}
CanDropDirective.decorators = [
    { type: Directive, args: [{ selector: '[canDrop]' },] },
];
/**
 * @nocollapse
 */
CanDropDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
];
CanDropDirective.propDecorators = {
    'canDropChange': [{ type: Output },],
    'canDrop': [{ type: Input },],
};
class CanDragDirective {
    /**
     * @param {?} ele
     * @param {?} render
     * @param {?} view
     */
    constructor(ele, render, view) {
        this.ele = ele;
        this.render = render;
        this.view = view;
        this._drop = true;
        this.canDragChange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        fromEvent$1(this.ele.nativeElement, 'dragstart').subscribe((ev) => {
            ev.dataTransfer.setData("name", this.canDrag);
        });
        fromEvent$1(this.ele.nativeElement, 'dragend').subscribe(res => {
            this.canDragChange.emit(this.canDrag);
        });
    }
}
CanDragDirective.decorators = [
    { type: Directive, args: [{ selector: '[canDrag]' },] },
];
/**
 * @nocollapse
 */
CanDragDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: ViewContainerRef, },
];
CanDragDirective.propDecorators = {
    '_drop': [{ type: HostBinding, args: ['attr.draggable',] },],
    'canDrag': [{ type: Input },],
    'canDragChange': [{ type: Output },],
};

class IDesignModule {
    /**
     * @param {?=} pages
     * @return {?}
     */
    static forRoot(pages = []) {
        return {
            ngModule: IDesignModule,
            providers: [{
                    provide: DESIGN_PAGES,
                    useValue: pages
                }]
        };
    }
}
IDesignModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    RouterModule.forChild([{
                            path: 'design',
                            component: DesignComponent
                        }]),
                    IDesignComponentModule
                ],
                exports: [
                    DesignLibraryComponent, DesignComponent,
                    DesignHistoryComponent, DesignPreviewComponent,
                    DesignSettingComponent, CanDropDirective, CanDragDirective,
                    DesignPagesComponent, IDesignComponentModule
                ],
                declarations: [
                    DesignLibraryComponent, DesignComponent,
                    DesignHistoryComponent, DesignPreviewComponent,
                    DesignSettingComponent, CanDropDirective, CanDragDirective,
                    DesignPagesComponent,
                ],
                providers: [
                    DesignService,
                    DesignLibraryService
                ],
            },] },
];
/**
 * @nocollapse
 */
IDesignModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { IDesignModule, DesignService, DESIGN_COMPONENTS, DESIGN_PAGES as ɵe, DesignComponent as ɵg, DesignHistoryComponent as ɵd, DesignLibraryComponent as ɵc, DesignPagesComponent as ɵf, DesignPreviewComponent as ɵb, DesignSettingComponent as ɵa, CanDragDirective as ɵi, CanDropDirective as ɵh };
//# sourceMappingURL=meepo-idesign.js.map
