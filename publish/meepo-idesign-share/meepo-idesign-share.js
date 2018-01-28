import { ComponentFactoryResolver, Directive, Inject, Injectable, InjectionToken, Input, IterableDiffers, NgModule, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
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
const DESIGN_COMPONENTS = new InjectionToken('DESIGN_COMPONENTS');
class DesignPropsService {
    /**
     * @param {?} props
     */
    constructor(props) {
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
    getPropsByName(name) {
        let /** @type {?} */ com;
        this.props.forEach((item) => {
            if (name === item.name) {
                com = item;
            }
        });
        return com;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addPropByName(name) {
        const /** @type {?} */ com = this.getPropsByName(name);
        this.pageProps.push(com);
        this.updateHistory();
    }
    /**
     * @param {?} uuid
     * @return {?}
     */
    removePropsByUid(uuid) {
        let /** @type {?} */ thisIndex;
        this.pageProps.map((res, index) => {
            if (res.uuid === uuid) {
                thisIndex = index;
            }
        });
        this.pageProps.splice(thisIndex, 1);
        this.updateHistory();
    }
    /**
     * @return {?}
     */
    getHistory() {
        let /** @type {?} */ local = localStorage.getItem(this.historyKey);
        if (local) {
            const /** @type {?} */ items = (JSON.parse(local));
            return items;
        }
        else {
            return [];
        }
    }
    /**
     * @return {?}
     */
    updateHistory() {
        this.historys.unshift({
            name: new Date().toISOString(),
            data: this.pageProps
        });
        if (this.historys.length > 50) {
            this.historys = this.historys.splice(this.historys.length, this.historys.length - 50);
        }
        localStorage.setItem(this.historyKey, JSON.stringify(this.historys));
    }
    /**
     * @param {?=} item
     * @return {?}
     */
    backToHistory(item = null) {
        if (!item) {
            item = this.getHistory()[0];
        }
        this.pageProps = item.data;
    }
}
DesignPropsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DesignPropsService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DESIGN_COMPONENTS,] },] },
];
class DesignLibraryService {
    /**
     * @param {?} components
     */
    constructor(components) {
        this.components = [];
        this.components = flatten(components);
        console.log('DesignLibraryService', this.components);
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
     * @param {?} props
     * @param {?} render
     */
    constructor(_viewContainerRef, _template, differs, librarys, props, render) {
        this._viewContainerRef = _viewContainerRef;
        this._template = _template;
        this.differs = differs;
        this.librarys = librarys;
        this.props = props;
        this.render = render;
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
            if (designLibraryProp) {
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
                if (designLibraryProp.props) {
                    componentRef.instance.props = designLibraryProp.props;
                }
                if (designLibraryProp.state) {
                    componentRef.instance.state = designLibraryProp.state;
                }
                componentRef.instance.onClick.subscribe(res => {
                    this.ngComponentClick && this.ngComponentClick(designLibraryProp);
                });
                componentRef.instance.setClass(this.ngComponentClass);
                componentRef.instance.setStyle(this.ngComponentStyle);
                if (this.ngComponentDrag) {
                    this.setDrage(componentRef.instance);
                }
                if (this.ngComponentDrop) {
                    this.setDrop(componentRef.instance);
                }
                designLibraryProp.uuid = componentRef.instance.guid;
                const /** @type {?} */ instanceComponent = new InstanceComponent(componentRef.instance.guid, designLibraryProp);
                this.instances.push(instanceComponent);
            }
        }
        catch (err) {
            console.log(`${this.ngComponentPreview ? 'preview' : 'setting'} is not fond`, item);
            console.dir(err);
        }
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
            ev.dataTransfer.setData("name", 'guid_' + instance.guid);
        });
        fromEvent$1(ele, 'dragend').subscribe((ev) => {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isGuid(name) {
        return name.indexOf('guid_') > -1;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    trimGuid(name) {
        return name.replace('guid_', '');
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
            var /** @type {?} */ uuid = this.trimGuid(data);
            console.log(instance, data);
            if (!this.isGuid(data)) {
                // 获取props
                const /** @type {?} */ props = this.props.getPropsByName(data);
                instance.props.children = instance.props.children || [];
                instance.props.children.push(props);
            }
            else if (uuid !== instance.guid) {
                // 移动已存在props
                let /** @type {?} */ props = this.getInstanceProps(uuid);
                if (props) {
                    instance.props.children.push(props);
                }
            }
        });
        fromEvent$1(ele, 'dragleave').subscribe((ev) => {
            // dragend 删除这一个
            this.render.removeStyle(ele, 'dashed');
            ev.preventDefault();
            ev.stopPropagation();
        });
        fromEvent$1(ele, 'dragover').subscribe((ev) => {
            this.render.setStyle(ele, 'dashed', '1px lodash red');
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
    { type: DesignPropsService, },
    { type: Renderer2, },
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
    /**
     * @param {?} coms
     * @return {?}
     */
    static forRoot(coms) {
        return {
            ngModule: IDesignComponentModule,
            providers: [{
                    provide: DESIGN_LIBRARYS,
                    useValue: coms,
                    multi: true
                }]
        };
    }
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
IDesignComponentModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { IDesignComponentModule, NgComponentDirective, InstanceComponent, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS, DesignPropsService, DESIGN_COMPONENTS };
//# sourceMappingURL=meepo-idesign-share.js.map
