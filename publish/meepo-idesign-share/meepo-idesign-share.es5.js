var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, ComponentFactoryResolver, Directive, Inject, Injectable, InjectionToken, Input, IterableDiffers, KeyValueDiffers, NgModule, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent as fromEvent$1 } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/**
 * @return {?}
 */
function guid() {
    /**
     * @return {?}
     */
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
/**
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
var DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
var instancesMap = new Map();
var InstanceComponent = (function () {
    /**
     * @param {?} guid
     * @param {?} props
     * @param {?} instance
     */
    function InstanceComponent(guid$$1, props, instance) {
        this.guid = guid$$1;
        this.props = props;
        this.instance = instance;
    }
    return InstanceComponent;
}());
var DesignApiService = (function () {
    function DesignApiService() {
    }
    /**
     * @param {?} id
     * @return {?}
     */
    DesignApiService.prototype.get = function (id) {
        return instancesMap.get(id);
    };
    /**
     * @param {?} instance
     * @param {?} designLibraryProp
     * @param {?} isPreview
     * @return {?}
     */
    DesignApiService.prototype.save = function (instance, designLibraryProp, isPreview) {
        var /** @type {?} */ instanceComponent = new InstanceComponent(instance.guid, designLibraryProp, instance);
        if (isPreview) {
            var /** @type {?} */ map$$1 = instancesMap.get(instance.guid);
            if (map$$1) {
                map$$1.view = instanceComponent;
            }
            else {
                map$$1 = {
                    setting: null,
                    view: instanceComponent
                };
            }
            instancesMap.set(instance.guid, map$$1);
        }
        else {
            var /** @type {?} */ map$$1 = instancesMap.get(instance.guid);
            if (map$$1) {
                map$$1.setting = instanceComponent;
            }
            else {
                map$$1 = {
                    setting: instanceComponent,
                    view: null
                };
            }
            instancesMap.set(instance.guid, map$$1);
        }
    };
    return DesignApiService;
}());
DesignApiService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignApiService.ctorParameters = function () { return []; };
var DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
var DesignPropsService = (function () {
    /**
     * @param {?} props
     * @param {?} library
     * @param {?} fb
     */
    function DesignPropsService(props, library, fb) {
        var _this = this;
        this.library = library;
        this.fb = fb;
        // 所有props
        this.props = [];
        // 当前页面
        this.pageProps = [];
        this.fathersProps = [];
        this.historyKey = 'historyKey';
        // 历史记录
        this.historys = [];
        this.removePosition = [];
        this.props = flatten(props);
        try {
            this.backToHistory();
        }
        catch (err) {
            localStorage.clear();
        }
        this.settingForm = this.fb.group({
            content: ''
        });
        this.settingForm.valueChanges.subscribe(function (res) {
            _this._settingProps.props['content'] = res.content;
        });
    }
    Object.defineProperty(DesignPropsService.prototype, "settingProps", {
        /**
         * @return {?}
         */
        get: function () {
            return this._settingProps;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            var _this = this;
            this._settingProps = val;
            try {
                this.settingForm.get('content').setValue(this._settingProps.props['content']);
            }
            catch (err) {
                this.settingForm.addControl('content', new FormControl(this._settingProps.props['content']));
            }
            try {
                if (!this._settingProps) {
                    this.fathersProps = [];
                }
                this.fathers = this.getFather(this.settingProps);
                if (this.fathers && this.fathers.length > 0) {
                    this.fathersProps = [];
                    this.fathers.map(function (res) {
                        var /** @type {?} */ props = _this.getPropsByUid(res);
                        if (props) {
                            _this.fathersProps.push(props);
                        }
                    });
                }
            }
            catch (err) { }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} designLibraryProp
     * @param {?} instance
     * @return {?}
     */
    DesignPropsService.prototype.setActiveSettingProps = function (designLibraryProp, instance) {
        this.settingProps = designLibraryProp;
        if (this.instance) {
            this.instance.removeClass('is-focus');
        }
        this.instance = instance;
        instance.addClass('is-focus');
    };
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
     * @param {?=} father
     * @return {?}
     */
    DesignPropsService.prototype.addPropByName = function (name, father) {
        var /** @type {?} */ com = this.getPropsByName(name);
        var /** @type {?} */ deepCopyCom = this.deepCopy(com);
        if (deepCopyCom) {
            if (deepCopyCom.uuid) {
                // 交换位置
            }
            else {
                deepCopyCom.uuid = guid();
                deepCopyCom.father = father || '';
                var /** @type {?} */ lib = this.library.get(deepCopyCom.name);
                deepCopyCom.props = new lib.default();
                this.pageProps.push(deepCopyCom);
                this.updateHistory();
            }
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.addPropsToInstanceByName = function (name) {
        var /** @type {?} */ props = this.getPropsByName(name);
        if (props) {
            if (this.instance) {
                var /** @type {?} */ deepProps = this.deepCopy(props);
                deepProps.father = this.instance.guid;
                var /** @type {?} */ lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.instance.props.children = this.instance.props.children || [];
                this.instance.props.children.push(deepProps);
            }
            else {
                var /** @type {?} */ deepProps = this.deepCopy(props);
                deepProps.father = null;
                var /** @type {?} */ lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.pageProps.push(deepProps);
            }
        }
    };
    /**
     * @return {?}
     */
    DesignPropsService.prototype.toFatherProps = function () {
        console.log(this.fathersProps);
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    DesignPropsService.prototype.deepCopy = function (obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        }
        catch (err) {
            console.dir(obj);
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.isGuid = function (name) {
        return name.indexOf('guid_') > -1;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.trimGuid = function (name) {
        return name.replace('guid_', '');
    };
    /**
     * @param {?} uuid
     * @return {?}
     */
    DesignPropsService.prototype.removePropsByUid = function (uuid) {
        uuid = this.trimGuid(uuid);
        var /** @type {?} */ props = this.getPropsByUid(uuid);
        if (props) {
            if (props.father) {
                var /** @type {?} */ father = this.getPropsByUid(props.father);
                try {
                    var /** @type {?} */ index = father.props.children.indexOf(props);
                    if (index > -1) {
                        var /** @type {?} */ children = father.props.children.splice(index, 1);
                        this.instance.setProps(Object.assign({}, father.props, {
                            children: children
                        }));
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                var /** @type {?} */ index = this.pageProps.indexOf(props);
                if (index > -1) {
                    this.pageProps.splice(index, 1);
                }
            }
        }
        this.updateHistory();
    };
    /**
     * @param {?} props
     * @param {?=} ids
     * @return {?}
     */
    DesignPropsService.prototype.getFather = function (props, ids) {
        if (ids === void 0) { ids = []; }
        ids.push(props.uuid);
        if (props.father) {
            var /** @type {?} */ father = this.getPropsByUid(props.father);
            if (father) {
                ids = this.getFather(((father)), ids);
            }
        }
        return ids;
    };
    /**
     * @param {?} uuid
     * @param {?=} data
     * @return {?}
     */
    DesignPropsService.prototype.getPropsByUid = function (uuid, data) {
        data = data || this.pageProps;
        for (var /** @type {?} */ i = 0; i < data.length; i++) {
            var /** @type {?} */ item = data[i];
            if (item.uuid + '' === uuid + '') {
                return item;
            }
            else if (item.props.children) {
                var /** @type {?} */ res = this.getPropsByUid(uuid, item.props.children);
                if (res) {
                    return res;
                }
            }
        }
        return false;
    };
    /**
     * @return {?}
     */
    DesignPropsService.prototype.getHistory = function () {
        var /** @type {?} */ local = localStorage.getItem(this.historyKey);
        if (local) {
            var /** @type {?} */ items = (JSON.parse(local));
            this.historys = items;
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
        if (item === void 0) { item = null; }
        if (!item) {
            item = this.getHistory()[0];
        }
        this.pageProps = item.data;
    };
    return DesignPropsService;
}());
DesignPropsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignPropsService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DESIGN_COMPONENTS,] },] },
    { type: DesignLibraryService, },
    { type: FormBuilder, },
]; };
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
var DRAG_DROP_ALL = new InjectionToken('DRAG_DROP_ALL');
var NgComponentDirective = (function () {
    /**
     * @param {?} _viewContainerRef
     * @param {?} _template
     * @param {?} differs
     * @param {?} librarys
     * @param {?} api
     * @param {?} props
     * @param {?} render
     * @param {?} dragDropAll
     */
    function NgComponentDirective(_viewContainerRef, _template, differs, librarys, api, props, render, dragDropAll) {
        this._viewContainerRef = _viewContainerRef;
        this._template = _template;
        this.differs = differs;
        this.librarys = librarys;
        this.api = api;
        this.props = props;
        this.render = render;
        this.dragDropAll = dragDropAll;
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
                    elInjector.get(ComponentFactoryResolver);
                var /** @type {?} */ componentFactory = componentFactoryResolver.resolveComponentFactory(component);
                var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, currentIndex, elInjector);
                // designLibraryProp.props = JSON.parse(JSON.stringify(designLibraryProp.props));
                var instance_1 = componentRef.instance;
                if (designLibraryProp_1.props) {
                    instance_1.props = designLibraryProp_1.props;
                }
                if (designLibraryProp_1.state) {
                    instance_1.state = designLibraryProp_1.state;
                }
                if (instance_1.onClick && instance_1.onClick.subscribe) {
                    instance_1.onClick.subscribe(function (ev) {
                        if (_this.ngComponentPreview) {
                            _this.props.setActiveSettingProps(designLibraryProp_1, instance_1);
                            ev.stopPropagation();
                        }
                    });
                }
                instance_1.setClass(instance_1.props.classObj);
                instance_1.setStyle(instance_1.props.style);
                instance_1.instance = this.ngComponentInstance;
                if (this.ngComponentDrag || this.dragDropAll) {
                    this.setDrage(instance_1);
                }
                if (this.ngComponentDrop || this.dragDropAll) {
                    this.setDrop(instance_1);
                }
                if (designLibraryProp_1.uuid) {
                    instance_1.guid = designLibraryProp_1.uuid;
                }
                else {
                    designLibraryProp_1.uuid = instance_1.guid = guid();
                }
                this.api.save(instance_1, designLibraryProp_1, this.ngComponentPreview);
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
        fromEvent$1(ele, 'dragstart').subscribe(function (ev) {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", 'guid_' + instance.guid);
            ev.stopPropagation();
        });
        fromEvent$1(ele, 'dragend').subscribe(function (ev) {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    };
    /**
     * @param {?} name
     * @return {?}
     */
    NgComponentDirective.prototype.isGuid = function (name) {
        return name.indexOf('guid_') > -1;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    NgComponentDirective.prototype.trimGuid = function (name) {
        return name.replace('guid_', '');
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    NgComponentDirective.prototype.deepCopy = function (obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        }
        catch (err) {
            console.dir(err);
            return {};
        }
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
            var /** @type {?} */ uuid = _this.trimGuid(data);
            if (!_this.isGuid(data)) {
                // 获取props
                var /** @type {?} */ props = _this.props.getPropsByName(data);
                instance.props.children = instance.props.children || [];
                var /** @type {?} */ deepProps = _this.deepCopy(props);
                // 记录上级
                deepProps.father = instance.guid;
                instance.props.children.push(deepProps);
                _this.props.instance.props.children.push(deepProps);
            }
            else if (uuid !== instance.guid) {
                // 移动已存在props
                var /** @type {?} */ props = _this.getInstanceProps(uuid);
                if (props) {
                    var /** @type {?} */ deepProps = _this.deepCopy(props);
                    deepProps.father = instance.guid;
                    instance.props.children.push(deepProps);
                }
            }
        });
        fromEvent$1(ele, 'dragleave').subscribe(function (ev) {
            // dragend 删除这一个
            _this.render.removeStyle(ele, 'dashed');
            ev.preventDefault();
            ev.stopPropagation();
        });
        fromEvent$1(ele, 'dragover').subscribe(function (ev) {
            _this.render.setStyle(ele, 'dashed', '1px lodash red');
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
    { type: DesignApiService, },
    { type: DesignPropsService, },
    { type: Renderer2, },
    { type: undefined, decorators: [{ type: Inject, args: [DRAG_DROP_ALL,] },] },
]; };
NgComponentDirective.propDecorators = {
    'ngComponent': [{ type: Input },],
    'ngComponentPreview': [{ type: Input },],
    'ngComponentState': [{ type: Input },],
    'ngComponentClass': [{ type: Input },],
    'ngComponentStyle': [{ type: Input },],
    'ngComponentDrag': [{ type: Input },],
    'ngComponentDrop': [{ type: Input },],
    'ngComponentInstance': [{ type: Input },],
    'ngComponentClick': [{ type: Input },],
};
var ControlBase = (function () {
    function ControlBase() {
    }
    /**
     * @param {?} name
     * @param {?=} _default
     * @return {?}
     */
    ControlBase.prototype.checkControl = function (name, _default) {
        if (_default === void 0) { _default = ''; }
        if (!this.props.contains(name)) {
            this.createControl(name, _default);
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    ControlBase.prototype.getStyle = function (name) {
        if (this.ele) {
            return this.ele.style[this.strToHump(name)];
        }
        else {
            return '';
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    ControlBase.prototype.strToHump = function (name) {
        var /** @type {?} */ re = /-(\w)/g;
        return name.replace(re, function ($0, $1) {
            return $1.toUpperCase();
        });
    };
    /**
     * @param {?} name
     * @param {?} _default
     * @return {?}
     */
    ControlBase.prototype.createControl = function (name, _default) {
        this.props.addControl(name, new FormControl(_default));
    };
    /**
     * @param {?} px
     * @return {?}
     */
    ControlBase.prototype.pxToNumber = function (px) {
        if (!px) {
            return '0';
        }
        return px.replace('px', '');
    };
    return ControlBase;
}());
ControlBase.propDecorators = {
    'ele': [{ type: Input },],
    'props': [{ type: Input },],
};
var ShareColorComponent = (function (_super) {
    __extends(ShareColorComponent, _super);
    function ShareColorComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    ShareColorComponent.prototype.ngOnInit = function () {
        this.checkControl('color', this.getStyle('color'));
        this.checkControl('background-color', this.getStyle('background-color'));
    };
    return ShareColorComponent;
}(ControlBase));
ShareColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-color',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u989C\u8272</h1>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u80CC\u666F\u8272:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"color\" placeholder=\"\u80CC\u666F\u8272\" [formControlName]=\"'background-color'\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u524D\u666F\u8272:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"color\" placeholder=\"\u80CC\u666F\u8272\" [formControlName]=\"'color'\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n      </div>\n    ",
                styles: ["\n      .row {\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        -webkit-box-orient: horizontal;\n        -webkit-box-direction: normal;\n            -ms-flex-direction: row;\n                flex-direction: row;\n        width: 100%;\n        margin-top: 5px; }\n        .row input {\n          -webkit-box-flex: 1;\n              -ms-flex: 1;\n                  flex: 1;\n          width: 50%; }\n    "]
            },] },
];
/**
 * @nocollapse
 */
ShareColorComponent.ctorParameters = function () { return []; };
var ShareSizeComponent = (function (_super) {
    __extends(ShareSizeComponent, _super);
    function ShareSizeComponent() {
        var _this = _super.call(this) || this;
        _this.unit = ['%', 'px'];
        return _this;
    }
    /**
     * @return {?}
     */
    ShareSizeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkControl("width." + this.unit[0], '100');
        this.checkControl("height.px", '50');
        this.checkControl("line-height.px", '50');
        this.checkControl("min-height.px", '50');
        this.checkControl("min-width." + this.unit[0], '100');
        try {
            this.props.controls['height.px'].valueChanges.subscribe(function (res) {
                _this.props.controls['line-height.px'].setValue(res);
                _this.props.controls['min-height.px'].setValue(res);
            });
            this.props.controls["width." + this.unit[0]].valueChanges.subscribe(function (res) {
                _this.props.controls["min-width." + _this.unit[0]].setValue(res);
            });
        }
        catch (err) {
            console.log(this.props.get('height.px'));
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    ShareSizeComponent.prototype.clearValue = function (name) {
        this.props.controls[name].setValue(null);
    };
    return ShareSizeComponent;
}(ControlBase));
ShareSizeComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-size',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u5927\u5C0F\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\">\n              <label class=\"setting-row-input-label\" for=\"setting-row-input-width\">\n                  \u5BBD\u5EA6:\n              </label>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" #width id=\"setting-row-input-width\" [attr.placeholder]=\"'\u5BBD\u5EA6'+unit[0]\" [formControlName]=\"'width.'+unit[0]\">\n              </div>\n              <span class=\"setting-row-input-unit\">\n                  {{unit[0]}}\n              </span>\n              <span (click)=\"clearValue('width.'+unit[0])\" class=\"setting-row-input-unit\">\u81EA\u52A8</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <label class=\"setting-row-input-label\" for=\"setting-row-input-height\">\n                  \u9AD8\u5EA6:\n              </label>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" id=\"setting-row-input-height\" placeholder=\"\u9AD8\u5EA6\" formControlName=\"height.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n              <span (click)=\"clearValue('height.px')\" class=\"setting-row-input-unit\">\u81EA\u52A8</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <label class=\"setting-row-input-label\" for=\"setting-row-input-height\">\n                  \u884C\u9AD8:\n              </label>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" id=\"setting-row-input-height\" placeholder=\"\u884C\u9AD8\" formControlName=\"line-height.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n              <span (click)=\"clearValue('line-height.px')\" class=\"setting-row-input-unit\">\u81EA\u52A8</span>\n          </div>\n      </div>\n    ",
                styles: ["\n      :host {\n        display: block; }\n    "]
            },] },
];
/**
 * @nocollapse
 */
ShareSizeComponent.ctorParameters = function () { return []; };
ShareSizeComponent.propDecorators = {
    'props': [{ type: Input },],
    'unit': [{ type: Input },],
};
var ShareBackgroundComponent = (function (_super) {
    __extends(ShareBackgroundComponent, _super);
    function ShareBackgroundComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    ShareBackgroundComponent.prototype.ngOnInit = function () {
        this.checkControl('background-image', '');
        this.checkControl('background-size', 'cover');
        this.checkControl('background-position', 'cover');
        this.checkControl('background-repeat', 'no-repeat');
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ShareBackgroundComponent.prototype.backgroundImageChange = function (e) {
        this.props.get('background-image').setValue("url(" + e.target.value + ")");
    };
    return ShareBackgroundComponent;
}(ControlBase));
ShareBackgroundComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-background',
                template: "\n      <!-- <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u80CC\u666F\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u56FE\u7247:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"text\" (change)=\"backgroundImageChange($event)\" [attr.value]=\"props.get('background-image').value\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u5E73\u94FA:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"text\" [formControlName]=\"'background-repeat'\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u5927\u5C0F:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"text\" [formControlName]=\"'background-size'\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u4F4D\u7F6E:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"text\" [formControlName]=\"'background-position'\">\n              </div>\n              <span class=\"setting-row-input-unit\"></span>\n          </div>\n      </div> -->\n    "
            },] },
];
/**
 * @nocollapse
 */
ShareBackgroundComponent.ctorParameters = function () { return []; };
var ShareMarginComponent = (function (_super) {
    __extends(ShareMarginComponent, _super);
    function ShareMarginComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    ShareMarginComponent.prototype.ngOnInit = function () {
        var /** @type {?} */ margin = this.props.get('margin').value;
        var _a = margin.split(" "), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        this.checkControl('margin-top.px', this.pxToNumber(top));
        this.checkControl('margin-right.px', this.pxToNumber(right));
        this.checkControl('margin-bottom.px', this.pxToNumber(bottom));
        this.checkControl('margin-left.px', this.pxToNumber(left));
    };
    return ShareMarginComponent;
}(ControlBase));
ShareMarginComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-margin',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u5916\u95F4\u8DDD\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0A\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"margin-top.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u53F3\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"margin-right.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0B\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"margin-bottom.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u5DE6\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"margin-left.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n      </div>\n    ",
                styles: ["\n      :host {\n        display: block; }\n    "]
            },] },
];
/**
 * @nocollapse
 */
ShareMarginComponent.ctorParameters = function () { return []; };
var SharePaddingComponent = (function (_super) {
    __extends(SharePaddingComponent, _super);
    function SharePaddingComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    SharePaddingComponent.prototype.ngOnInit = function () {
        this.checkControl('padding', '0');
        var /** @type {?} */ margin = this.props.get('padding').value;
        var _a = margin.split(" "), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        this.checkControl('padding-top.px', this.pxToNumber(top));
        this.checkControl('padding-right.px', this.pxToNumber(right));
        this.checkControl('padding-bottom.px', this.pxToNumber(bottom));
        this.checkControl('padding-left.px', this.pxToNumber(left));
    };
    return SharePaddingComponent;
}(ControlBase));
SharePaddingComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-padding',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u5167\u95F4\u8DDD\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0A\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"padding-top.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u53F3\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"padding-right.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0B\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"padding-bottom.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u5DE6\u95F4\u8DDD:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"padding-left.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n      </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
SharePaddingComponent.ctorParameters = function () { return []; };
var ShareBorderComponent = (function (_super) {
    __extends(ShareBorderComponent, _super);
    function ShareBorderComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    ShareBorderComponent.prototype.ngOnInit = function () {
        if (this.props.contains('border')) {
            var /** @type {?} */ border = this.props.get('border').value;
            var _a = border.split(' '), width = _a[0], style = _a[1], color = _a[2];
            this.checkControl('border-top-width.px', this.pxToNumber(width));
            this.checkControl('border-right-width.px', this.pxToNumber(width));
            this.checkControl('border-bottom-width.px', this.pxToNumber(width));
            this.checkControl('border-left-width.px', this.pxToNumber(width));
            this.checkControl('border-color', color);
            this.checkControl('border-style', style);
        }
    };
    return ShareBorderComponent;
}(ControlBase));
ShareBorderComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-border',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u8FB9\u6846\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\" *ngIf=\"props.contains('border-top-width.px')\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0A\u8FB9\u6846:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" min=\"0\" step=\"1\" formControlName=\"border-top-width.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\" *ngIf=\"props.contains('border-right-width.px')\">\n              <div class=\"setting-row-input-label\">\n                  \u53F3\u8FB9\u6846:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" min=\"0\" step=\"1\" formControlName=\"border-right-width.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\" *ngIf=\"props.contains('border-bottom-width.px')\">\n              <div class=\"setting-row-input-label\">\n                  \u4E0B\u8FB9\u6846:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" min=\"0\" step=\"1\" formControlName=\"border-bottom-width.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n          <div class=\"setting-row-input\" *ngIf=\"props.contains('border-left-width.px')\">\n              <div class=\"setting-row-input-label\">\n                  \u5DE6\u8FB9\u6846:\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" min=\"0\" step=\"1\" formControlName=\"border-left-width.px\">\n              </div>\n              <span class=\"setting-row-input-unit\">px</span>\n          </div>\n      </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
ShareBorderComponent.ctorParameters = function () { return []; };
var ShareSwiperComponent = (function (_super) {
    __extends(ShareSwiperComponent, _super);
    function ShareSwiperComponent() {
        return _super.call(this) || this;
    }
    /**
     * @return {?}
     */
    ShareSwiperComponent.prototype.ngOnInit = function () {
        this.checkControl('loop', 'true');
        this.checkControl('speed', '300');
        this.checkControl('delay', '3000');
        this.checkControl('effect', 'slide');
        this.checkControl('pagination', 'bullets');
    };
    return ShareSwiperComponent;
}(ControlBase));
ShareSwiperComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-swiper',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n          <h1>\u6ED1\u52A8\u8BBE\u7F6E</h1>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u662F\u5426\u5FAA\u73AF\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <select formControlName=\"loop\">\n                      <option value=\"true\">\u5FAA\u73AF</option>\n                      <option value=\"false\">\u4E0D\u5FAA\u73AF</option>\n                  </select>\n              </div>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u901F\u5EA6\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"speed\">\n              </div>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u5207\u6362\u52A8\u753B\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <select formControlName=\"effect\">\n                      <option value=\"slide\">slide</option>\n                      <option value=\"fade\">fade</option>\n                      <option value=\"cube\">cube</option>\n                      <option value=\"coverflow\">coverflow</option>\n                      <option value=\"flip\">flip</option>\n                  </select>\n              </div>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u81EA\u52A8\u64AD\u653E\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <input type=\"number\" formControlName=\"delay\">\n              </div>\n          </div>\n          <div class=\"setting-row-input\">\n              <div class=\"setting-row-input-label\">\n                  \u9875\u7801\n              </div>\n              <div class=\"setting-row-input-content\">\n                  <select formControlName=\"pagination\">\n                      <option value=\"bullets\">bullets</option>\n                      <option value=\"fraction\">fraction</option>\n                      <option value=\"progressbar\">progressbar</option>\n                      <option value=\"custom\">custom</option>\n                  </select>\n              </div>\n          </div>\n      </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
ShareSwiperComponent.ctorParameters = function () { return []; };
var SharePositionComponent = (function (_super) {
    __extends(SharePositionComponent, _super);
    function SharePositionComponent() {
        var _this = _super.call(this) || this;
        _this._noup = false;
        _this._nodown = false;
        return _this;
    }
    Object.defineProperty(SharePositionComponent.prototype, "noup", {
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._noup = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharePositionComponent.prototype, "nodown", {
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._nodown = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SharePositionComponent.prototype.ngOnInit = function () {
        this.checkControl('position', 'relative');
        this.checkControl('left.px', '0');
        this.checkControl('right.px', '0');
        if (!this._noup) {
            this.checkControl('top.px', '0');
        }
        if (!this._nodown) {
            this.checkControl('bottom.px', '0');
        }
    };
    return SharePositionComponent;
}(ControlBase));
SharePositionComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-position',
                template: "\n      <div class=\"setting-row\" [formGroup]=\"props\">\n              <h1>\n                  \u5B9A\u4F4D\n              </h1>\n              <div class=\"setting-row-input\" *ngIf=\"!_noup\">\n                  <div class=\"setting-row-input-label\">\n                      \u4E0A:\n                  </div>\n                  <div class=\"setting-row-input-content\">\n                      <input type=\"number\" formControlName=\"top.px\">\n                  </div>\n                  <span class=\"setting-row-input-unit\">px</span>\n              </div>\n              <div class=\"setting-row-input\">\n                  <div class=\"setting-row-input-label\">\n                      \u53F3:\n                  </div>\n                  <div class=\"setting-row-input-content\">\n                      <input type=\"number\" formControlName=\"right.px\">\n                  </div>\n                  <span class=\"setting-row-input-unit\">px</span>\n              </div>\n              <div class=\"setting-row-input\" *ngIf=\"!_nodown\">\n                  <div class=\"setting-row-input-label\">\n                      \u4E0B:\n                  </div>\n                  <div class=\"setting-row-input-content\">\n                      <input type=\"number\" formControlName=\"bottom.px\">\n                  </div>\n                  <span class=\"setting-row-input-unit\">px</span>\n              </div>\n              <div class=\"setting-row-input\">\n                  <div class=\"setting-row-input-label\">\n                      \u5DE6:\n                  </div>\n                  <div class=\"setting-row-input-content\">\n                      <input type=\"number\" formControlName=\"left.px\">\n                  </div>\n                  <span class=\"setting-row-input-unit\">px</span>\n              </div>\n          </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
SharePositionComponent.ctorParameters = function () { return []; };
SharePositionComponent.propDecorators = {
    'noup': [{ type: Input },],
    'nodown': [{ type: Input },],
};
var shareComponents = [
    ShareColorComponent,
    ShareSizeComponent,
    ShareBackgroundComponent,
    ShareMarginComponent,
    SharePaddingComponent,
    SharePositionComponent,
    ShareBorderComponent,
    ShareSwiperComponent
];
var NgEachOfContext = (function () {
    /**
     * @param {?} $implicit
     * @param {?} ngEachOf
     * @param {?} key
     */
    function NgEachOfContext($implicit, ngEachOf, key) {
        this.$implicit = $implicit;
        this.ngEachOf = ngEachOf;
        this.key = key;
    }
    return NgEachOfContext;
}());
var NgEachOf = (function () {
    /**
     * @param {?} _viewContainer
     * @param {?} _template
     * @param {?} _differs
     */
    function NgEachOf(_viewContainer, _template, _differs) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this._differ = null;
    }
    Object.defineProperty(NgEachOf.prototype, "ngForTemplate", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value) {
                this._template = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    NgEachOf.prototype.ngOnChanges = function (changes) {
        this._viewContainer.clear();
        if ('ngEachOf' in changes) {
            var /** @type {?} */ value = changes['ngEachOf'].currentValue;
            this._applyChanges(value);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgEachOf.prototype._applyChanges = function (changes) {
        for (var /** @type {?} */ key in changes) {
            var /** @type {?} */ item = changes[key];
            var /** @type {?} */ view = this._viewContainer.createEmbeddedView(this._template, new NgEachOfContext(item, this.ngEachOf, key), parseInt(key, 16));
        }
    };
    return NgEachOf;
}());
NgEachOf.decorators = [
    { type: Directive, args: [{ selector: '[ngEach][ngEachOf]' },] },
];
/**
 * @nocollapse
 */
NgEachOf.ctorParameters = function () { return [
    { type: ViewContainerRef, },
    { type: TemplateRef, },
    { type: KeyValueDiffers, },
]; };
NgEachOf.propDecorators = {
    'ngEachOf': [{ type: Input },],
    'ngForTemplate': [{ type: Input },],
};
var IDesignComponentModule = (function () {
    function IDesignComponentModule() {
    }
    /**
     * @param {?} coms
     * @param {?=} dragDropAll
     * @return {?}
     */
    IDesignComponentModule.forRoot = function (coms, dragDropAll) {
        if (dragDropAll === void 0) { dragDropAll = false; }
        return {
            ngModule: IDesignComponentModule,
            providers: [{
                    provide: DESIGN_LIBRARYS,
                    useValue: coms,
                    multi: true
                }, {
                    provide: DRAG_DROP_ALL,
                    useValue: dragDropAll
                }]
        };
    };
    return IDesignComponentModule;
}());
IDesignComponentModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    ReactiveFormsModule
                ],
                exports: [
                    NgComponentDirective
                ].concat(shareComponents, [
                    NgEachOf
                ]),
                declarations: [
                    NgComponentDirective
                ].concat(shareComponents, [
                    NgEachOf
                ]),
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
 * Generated bundle index. Do not edit.
 */
export { IDesignComponentModule, NgComponentDirective, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS, DesignPropsService, DESIGN_COMPONENTS, guid, ShareBackgroundComponent as ɵf, ControlBase as ɵd, ShareBorderComponent as ɵj, ShareColorComponent as ɵc, ShareMarginComponent as ɵg, SharePaddingComponent as ɵh, SharePositionComponent as ɵi, shareComponents as ɵb, ShareSizeComponent as ɵe, ShareSwiperComponent as ɵk, DRAG_DROP_ALL as ɵa, NgEachOf as ɵm, NgEachOfContext as ɵl };
//# sourceMappingURL=meepo-idesign-share.es5.js.map
