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
const DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
class DesignApiService {
    constructor() { }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) { }
    /**
     * @param {?} data
     * @param {?} id
     * @return {?}
     */
    save(data, id) { }
}
DesignApiService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignApiService.ctorParameters = () => [];
class DesignLibraryService {
    /**
     * @param {?} components
     */
    constructor(components) {
        this.components = [];
        this.components = flatten(components);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    get(name) {
        let /** @type {?} */ com;
        this.components.map(item => {
            if (item[name]) {
                com = item[name];
            }
        });
        return com;
    }
}
DesignLibraryService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignLibraryService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DESIGN_LIBRARYS,] },] },
];

class NgComponentDirective {
    /**
     * @param {?} _viewContainerRef
     * @param {?} _template
     * @param {?} differs
     * @param {?} librarys
     */
    constructor(_viewContainerRef, _template, differs, librarys) {
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
    ngDoCheck() {
        if (this._differ) {
            const /** @type {?} */ changes = this._differ.diff(this.ngComponent);
            if (changes) {
                changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
                    if (item.previousIndex == null) {
                        this.createComponent(item, currentIndex);
                    }
                    else if (currentIndex == null) {
                        this._viewContainerRef.remove(adjustedPreviousIndex);
                    }
                    else {
                        const /** @type {?} */ view = ((this._viewContainerRef.get(adjustedPreviousIndex)));
                        this._viewContainerRef.move(view, currentIndex);
                    }
                });
            }
        }
    }
    /**
     * @param {?} item
     * @param {?} currentIndex
     * @return {?}
     */
    createComponent(item, currentIndex) {
        try {
            const /** @type {?} */ designLibraryProp = item.item;
            let /** @type {?} */ component;
            const /** @type {?} */ libs = this.librarys.get(designLibraryProp.name);
            if (this.ngComponentPreview) {
                component = libs.view;
            }
            else {
                component = libs.setting;
            }
            const /** @type {?} */ elInjector = this.viewContainerRef.parentInjector;
            const /** @type {?} */ componentFactoryResolver = this.moduleRef ? this.moduleRef.componentFactoryResolver :
                elInjector.get(ComponentFactoryResolver);
            const /** @type {?} */ componentFactory = componentFactoryResolver.resolveComponentFactory(component);
            const /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, currentIndex, elInjector);
            // designLibraryProp.props = JSON.parse(JSON.stringify(designLibraryProp.props));
            componentRef.instance.props = designLibraryProp.props;
            componentRef.instance.onClick.subscribe(res => {
                this.ngComponentClick && this.ngComponentClick(designLibraryProp);
            });
            componentRef.instance.setClass(this.ngComponentClass);
            componentRef.instance.setStyle(this.ngComponentStyle);
            this.setDrage(componentRef.instance);
            this.setDrop(componentRef.instance);
            designLibraryProp.uuid = componentRef.instance.guid;
            const /** @type {?} */ instanceComponent = new InstanceComponent(componentRef.instance.guid, designLibraryProp);
            this.instances.push(instanceComponent);
        }
        catch (err) { }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.viewContainerRef.clear();
        if ('ngComponent' in changes) {
            const /** @type {?} */ value = changes['ngComponent'].currentValue;
            if (value && !this._differ) {
                try {
                    this._differ = this.differs.find(value).create();
                }
                catch (err) { }
            }
        }
    }
    /**
     * @param {?} instance
     * @return {?}
     */
    setDrage(instance) {
        instance.setAttribute({
            draggable: true
        });
        const /** @type {?} */ ele = instance.ele.nativeElement;
        let /** @type {?} */ uuid;
        fromEvent$1(ele, 'dragstart').subscribe((ev) => {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", instance.guid);
        });
        fromEvent$1(ele, 'dragleave').subscribe((ev) => {
            // dragend 删除这一个
        });
        fromEvent$1(ele, 'dragend').subscribe((ev) => {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    }
    /**
     * @param {?} instance
     * @return {?}
     */
    setDrop(instance) {
        const /** @type {?} */ ele = instance.ele.nativeElement;
        fromEvent$1(ele, 'drop').subscribe((ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            var /** @type {?} */ data = ev.dataTransfer.getData("name");
            if (instance.guid !== data) {
                // 自己放置自己 忽略 否则提示是放入内部还是互换位置
                let /** @type {?} */ props = this.getInstanceProps(data);
                if (props) {
                    instance.props.children.push(props);
                }
            }
        });
        fromEvent$1(ele, 'dragover').subscribe((ev) => {
            ele.style.bor;
            ev.preventDefault();
            ev.stopPropagation();
        });
    }
    /**
     * @param {?} uuid
     * @return {?}
     */
    getInstanceProps(uuid) {
        let /** @type {?} */ props;
        this.instances.map(res => {
            if (res.guid === uuid) {
                props = res.props;
            }
        });
        return props;
    }
}
NgComponentDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngComponent]' },] },
];
/**
 * @nocollapse
 */
NgComponentDirective.ctorParameters = () => [
    { type: ViewContainerRef, },
    { type: TemplateRef, },
    { type: IterableDiffers, },
    { type: DesignLibraryService, },
];
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
class InstanceComponent {
    /**
     * @param {?} guid
     * @param {?} props
     */
    constructor(guid, props) {
        this.guid = guid;
        this.props = props;
    }
}

class IDesignComponentModule {
}
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
IDesignComponentModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { IDesignComponentModule, NgComponentDirective, InstanceComponent, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS };
//# sourceMappingURL=meepo-idesign-share.js.map
