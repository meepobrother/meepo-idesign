(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/observable/fromEvent'), require('rxjs/add/operator/switchMap'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/observable/fromEvent', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/map'], factory) :
	(factory((global['meepo-idesign-share'] = {}),global.ng.core,global.Rx.Observable));
}(this, (function (exports,core,fromEvent) { 'use strict';

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
var DESIGN_LIBRARYS = new core.InjectionToken('DESIGN_LIBRARYS');
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
        deepCopyCom.uuid = guid();
        deepCopyCom.father = father || '';
        this.pageProps.push(deepCopyCom);
        this.updateHistory();
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DesignPropsService.prototype.addPropsToInstanceByName = function (name) {
        var /** @type {?} */ props = this.getPropsByName(name);
        if (props) {
            var /** @type {?} */ deepProps = this.deepCopy(props);
            deepProps.father = this.instance.guid;
            deepProps.uuid = guid();
            this.instance.props.children = this.instance.props.children || [];
            this.instance.props.children.push(deepProps);
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
                var /** @type {?} */ index = father.props.children.indexOf(props);
                if (index > -1) {
                    father.props.children.splice(index, 1);
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
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DesignPropsService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [DESIGN_COMPONENTS,] },] },
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
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DesignLibraryService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [DESIGN_LIBRARYS,] },] },
]; };
var DRAG_DROP_ALL = new core.InjectionToken('DRAG_DROP_ALL');
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
                    elInjector.get(core.ComponentFactoryResolver);
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
                instance_1.onClick.subscribe(function (ev) {
                    if (_this.ngComponentPreview) {
                        _this.props.settingProps = designLibraryProp_1;
                        _this.props.instance = instance_1;
                    }
                });
                instance_1.setClass(this.ngComponentClass);
                instance_1.setStyle(this.ngComponentStyle);
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
                // api
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
        fromEvent.fromEvent(ele, 'dragstart').subscribe(function (ev) {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", 'guid_' + instance.guid);
            ev.stopPropagation();
        });
        fromEvent.fromEvent(ele, 'dragend').subscribe(function (ev) {
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
        fromEvent.fromEvent(ele, 'drop').subscribe(function (ev) {
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
        fromEvent.fromEvent(ele, 'dragleave').subscribe(function (ev) {
            // dragend 删除这一个
            _this.render.removeStyle(ele, 'dashed');
            ev.preventDefault();
            ev.stopPropagation();
        });
        fromEvent.fromEvent(ele, 'dragover').subscribe(function (ev) {
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
    { type: core.Directive, args: [{ selector: '[ngComponent]' },] },
];
/**
 * @nocollapse
 */
NgComponentDirective.ctorParameters = function () { return [
    { type: core.ViewContainerRef, },
    { type: core.TemplateRef, },
    { type: core.IterableDiffers, },
    { type: DesignLibraryService, },
    { type: DesignApiService, },
    { type: DesignPropsService, },
    { type: core.Renderer2, },
    { type: undefined, decorators: [{ type: core.Inject, args: [DRAG_DROP_ALL,] },] },
]; };
NgComponentDirective.propDecorators = {
    'ngComponent': [{ type: core.Input },],
    'ngComponentPreview': [{ type: core.Input },],
    'ngComponentState': [{ type: core.Input },],
    'ngComponentClass': [{ type: core.Input },],
    'ngComponentStyle': [{ type: core.Input },],
    'ngComponentDrag': [{ type: core.Input },],
    'ngComponentDrop': [{ type: core.Input },],
    'ngComponentInstance': [{ type: core.Input },],
    'ngComponentClick': [{ type: core.Input },],
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

exports.IDesignComponentModule = IDesignComponentModule;
exports.NgComponentDirective = NgComponentDirective;
exports.DesignApiService = DesignApiService;
exports.DesignLibraryService = DesignLibraryService;
exports.DESIGN_LIBRARYS = DESIGN_LIBRARYS;
exports.DesignPropsService = DesignPropsService;
exports.DESIGN_COMPONENTS = DESIGN_COMPONENTS;
exports.ɵa = DRAG_DROP_ALL;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=meepo-idesign-share.umd.js.map
