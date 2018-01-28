import { ComponentFactoryResolver, Directive, Inject, Injectable, InjectionToken, Input, IterableDiffers, NgModule, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent as fromEvent$1 } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

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
const DESIGN_LIBRARYS = new InjectionToken('DESIGN_LIBRARYS');
const instancesMap = new Map();
class InstanceComponent {
    /**
     * @param {?} guid
     * @param {?} props
     * @param {?} instance
     */
    constructor(guid$$1, props, instance) {
        this.guid = guid$$1;
        this.props = props;
        this.instance = instance;
    }
}
class DesignApiService {
    constructor() { }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return instancesMap.get(id);
    }
    /**
     * @param {?} instance
     * @param {?} designLibraryProp
     * @param {?} isPreview
     * @return {?}
     */
    save(instance, designLibraryProp, isPreview) {
        const /** @type {?} */ instanceComponent = new InstanceComponent(instance.guid, designLibraryProp, instance);
        if (isPreview) {
            let /** @type {?} */ map$$1 = instancesMap.get(instance.guid);
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
            let /** @type {?} */ map$$1 = instancesMap.get(instance.guid);
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
    }
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
    /**
     * @param {?} val
     * @return {?}
     */
    set settingProps(val) {
        this._settingProps = val;
        try {
            if (!this._settingProps) {
                this.fathersProps = [];
            }
            this.fathers = this.getFather(this.settingProps);
            if (this.fathers && this.fathers.length > 0) {
                this.fathersProps = [];
                this.fathers.map(res => {
                    const /** @type {?} */ props = this.getPropsByUid(res);
                    if (props) {
                        this.fathersProps.push(props);
                    }
                });
            }
        }
        catch (err) { }
    }
    /**
     * @return {?}
     */
    get settingProps() {
        return this._settingProps;
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
     * @param {?=} father
     * @return {?}
     */
    addPropByName(name, father) {
        const /** @type {?} */ com = this.getPropsByName(name);
        const /** @type {?} */ deepCopyCom = this.deepCopy(com);
        deepCopyCom.uuid = guid();
        deepCopyCom.father = father || '';
        this.pageProps.push(deepCopyCom);
        this.updateHistory();
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addPropsToInstanceByName(name) {
        let /** @type {?} */ props = this.getPropsByName(name);
        if (props) {
            const /** @type {?} */ deepProps = this.deepCopy(props);
            deepProps.father = this.instance.guid;
            deepProps.uuid = guid();
            this.instance.props.children = this.instance.props.children || [];
            this.instance.props.children.push(deepProps);
        }
    }
    /**
     * @return {?}
     */
    toFatherProps() {
        console.log(this.fathersProps);
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    deepCopy(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        }
        catch (err) {
            console.dir(obj);
        }
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
     * @param {?} uuid
     * @return {?}
     */
    removePropsByUid(uuid) {
        uuid = this.trimGuid(uuid);
        let /** @type {?} */ props = this.getPropsByUid(uuid);
        if (props) {
            if (props.father) {
                let /** @type {?} */ father = this.getPropsByUid(props.father);
                let /** @type {?} */ index = father.props.children.indexOf(props);
                if (index > -1) {
                    father.props.children.splice(index, 1);
                }
            }
            else {
                let /** @type {?} */ index = this.pageProps.indexOf(props);
                if (index > -1) {
                    this.pageProps.splice(index, 1);
                }
            }
        }
        this.updateHistory();
    }
    /**
     * @param {?} props
     * @param {?=} ids
     * @return {?}
     */
    getFather(props, ids = []) {
        ids.push(props.uuid);
        if (props.father) {
            let /** @type {?} */ father = this.getPropsByUid(props.father);
            if (father) {
                ids = this.getFather(((father)), ids);
            }
        }
        return ids;
    }
    /**
     * @param {?} uuid
     * @param {?=} data
     * @return {?}
     */
    getPropsByUid(uuid, data) {
        data = data || this.pageProps;
        for (let /** @type {?} */ i = 0; i < data.length; i++) {
            const /** @type {?} */ item = data[i];
            if (item.uuid + '' === uuid + '') {
                return item;
            }
            else if (item.props.children) {
                const /** @type {?} */ res = this.getPropsByUid(uuid, item.props.children);
                if (res) {
                    return res;
                }
            }
        }
        return false;
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

const DRAG_DROP_ALL = new InjectionToken('DRAG_DROP_ALL');
class NgComponentDirective {
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
    constructor(_viewContainerRef, _template, differs, librarys, api, props, render, dragDropAll) {
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
                const { instance } = componentRef;
                if (designLibraryProp.props) {
                    instance.props = designLibraryProp.props;
                }
                if (designLibraryProp.state) {
                    instance.state = designLibraryProp.state;
                }
                instance.onClick.subscribe((ev) => {
                    if (this.ngComponentPreview) {
                        this.props.settingProps = designLibraryProp;
                        this.props.instance = instance;
                    }
                });
                instance.setClass(this.ngComponentClass);
                instance.setStyle(this.ngComponentStyle);
                instance.instance = this.ngComponentInstance;
                if (this.ngComponentDrag || this.dragDropAll) {
                    this.setDrage(instance);
                }
                if (this.ngComponentDrop || this.dragDropAll) {
                    this.setDrop(instance);
                }
                if (designLibraryProp.uuid) {
                    instance.guid = designLibraryProp.uuid;
                }
                else {
                    designLibraryProp.uuid = instance.guid = guid();
                }
                // api
                this.api.save(instance, designLibraryProp, this.ngComponentPreview);
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
            ev.stopPropagation();
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
     * @param {?} obj
     * @return {?}
     */
    deepCopy(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        }
        catch (err) {
            console.dir(err);
            return {};
        }
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
            if (!this.isGuid(data)) {
                // 获取props
                const /** @type {?} */ props = this.props.getPropsByName(data);
                instance.props.children = instance.props.children || [];
                const /** @type {?} */ deepProps = this.deepCopy(props);
                // 记录上级
                deepProps.father = instance.guid;
                instance.props.children.push(deepProps);
                this.props.instance.props.children.push(deepProps);
            }
            else if (uuid !== instance.guid) {
                // 移动已存在props
                let /** @type {?} */ props = this.getInstanceProps(uuid);
                if (props) {
                    const /** @type {?} */ deepProps = this.deepCopy(props);
                    deepProps.father = instance.guid;
                    instance.props.children.push(deepProps);
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
    { type: DesignApiService, },
    { type: DesignPropsService, },
    { type: Renderer2, },
    { type: undefined, decorators: [{ type: Inject, args: [DRAG_DROP_ALL,] },] },
];
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

class IDesignComponentModule {
    /**
     * @param {?} coms
     * @param {?=} dragDropAll
     * @return {?}
     */
    static forRoot(coms, dragDropAll = false) {
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

export { IDesignComponentModule, NgComponentDirective, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS, DesignPropsService, DESIGN_COMPONENTS, DRAG_DROP_ALL as ɵa };
//# sourceMappingURL=meepo-idesign-share.js.map
