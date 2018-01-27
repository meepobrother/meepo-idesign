import { ComponentFactoryResolver, Directive, Inject, Injectable, InjectionToken, Input, IterableDiffers, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent as fromEvent$1 } from 'rxjs/observable/fromEvent';
/**
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
var DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
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
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignApiService.ctorParameters = function () { return []; };
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
/**
 * Generated bundle index. Do not edit.
 */
export { IDesignComponentModule, NgComponentDirective, InstanceComponent, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS };
//# sourceMappingURL=meepo-idesign-share.es5.js.map
