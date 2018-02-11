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
     * @param {?} library
     * @param {?} fb
     */
    constructor(props, library, fb) {
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
        this.settingForm.valueChanges.subscribe(res => {
            this._settingProps.props['content'] = res.content;
        });
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set settingProps(val) {
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
     * @param {?} designLibraryProp
     * @param {?} instance
     * @return {?}
     */
    setActiveSettingProps(designLibraryProp, instance) {
        this.settingProps = designLibraryProp;
        if (this.instance) {
            this.instance.removeClass('is-focus');
        }
        this.instance = instance;
        instance.addClass('is-focus');
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
        if (deepCopyCom) {
            if (deepCopyCom.uuid) {
                // 交换位置
            }
            else {
                deepCopyCom.uuid = guid();
                deepCopyCom.father = father || '';
                const /** @type {?} */ lib = this.library.get(deepCopyCom.name);
                deepCopyCom.props = new lib.default();
                this.pageProps.push(deepCopyCom);
                this.updateHistory();
            }
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addPropsToInstanceByName(name) {
        let /** @type {?} */ props = this.getPropsByName(name);
        if (props) {
            if (this.instance) {
                const /** @type {?} */ deepProps = this.deepCopy(props);
                deepProps.father = this.instance.guid;
                const /** @type {?} */ lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.instance.props.children = this.instance.props.children || [];
                this.instance.props.children.push(deepProps);
            }
            else {
                const /** @type {?} */ deepProps = this.deepCopy(props);
                deepProps.father = null;
                const /** @type {?} */ lib = this.library.get(deepProps.name);
                deepProps.props = new lib.default();
                deepProps.uuid = guid();
                this.pageProps.push(deepProps);
            }
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
                try {
                    let /** @type {?} */ index = father.props.children.indexOf(props);
                    if (index > -1) {
                        const /** @type {?} */ children = father.props.children.splice(index, 1);
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
            this.historys = items;
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
    { type: DesignLibraryService, },
    { type: FormBuilder, },
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
                if (instance.onClick && instance.onClick.subscribe) {
                    instance.onClick.subscribe((ev) => {
                        if (this.ngComponentPreview) {
                            this.props.setActiveSettingProps(designLibraryProp, instance);
                            ev.stopPropagation();
                        }
                    });
                }
                instance.setClass(instance.props.classObj);
                instance.setStyle(instance.props.style);
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

class ControlBase {
    constructor() { }
    /**
     * @param {?} name
     * @param {?=} _default
     * @return {?}
     */
    checkControl(name, _default = '') {
        if (!this.props.contains(name)) {
            this.createControl(name, _default);
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getStyle(name) {
        if (this.ele) {
            return this.ele.style[this.strToHump(name)];
        }
        else {
            return '';
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    strToHump(name) {
        const /** @type {?} */ re = /-(\w)/g;
        return name.replace(re, function ($0, $1) {
            return $1.toUpperCase();
        });
    }
    /**
     * @param {?} name
     * @param {?} _default
     * @return {?}
     */
    createControl(name, _default) {
        this.props.addControl(name, new FormControl(_default));
    }
    /**
     * @param {?} px
     * @return {?}
     */
    pxToNumber(px) {
        if (!px) {
            return '0';
        }
        return px.replace('px', '');
    }
}
ControlBase.propDecorators = {
    'ele': [{ type: Input },],
    'props': [{ type: Input },],
};

class ShareColorComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl('color', this.getStyle('color'));
        this.checkControl('background-color', this.getStyle('background-color'));
    }
}
ShareColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-color',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>颜色</h1>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  背景色:
              </div>
              <div class="setting-row-input-content">
                  <input type="color" placeholder="背景色" [formControlName]="'background-color'">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  前景色:
              </div>
              <div class="setting-row-input-content">
                  <input type="color" placeholder="背景色" [formControlName]="'color'">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
      </div>
    `,
                styles: [`
      .row {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
            -ms-flex-direction: row;
                flex-direction: row;
        width: 100%;
        margin-top: 5px; }
        .row input {
          -webkit-box-flex: 1;
              -ms-flex: 1;
                  flex: 1;
          width: 50%; }
    `]
            },] },
];
/**
 * @nocollapse
 */
ShareColorComponent.ctorParameters = () => [];

class ShareSizeComponent extends ControlBase {
    constructor() {
        super();
        this.unit = ['%', 'px'];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl(`width.${this.unit[0]}`, '100');
        this.checkControl(`height.px`, '50');
        this.checkControl(`line-height.px`, '50');
        this.checkControl(`min-height.px`, '50');
        this.checkControl(`min-width.${this.unit[0]}`, '100');
        try {
            this.props.controls['height.px'].valueChanges.subscribe(res => {
                this.props.controls['line-height.px'].setValue(res);
                this.props.controls['min-height.px'].setValue(res);
            });
            this.props.controls[`width.${this.unit[0]}`].valueChanges.subscribe(res => {
                this.props.controls[`min-width.${this.unit[0]}`].setValue(res);
            });
        }
        catch (err) {
            console.log(this.props.get('height.px'));
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    clearValue(name) {
        this.props.controls[name].setValue(null);
    }
}
ShareSizeComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-size',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>大小设置</h1>
          <div class="setting-row-input">
              <label class="setting-row-input-label" for="setting-row-input-width">
                  宽度:
              </label>
              <div class="setting-row-input-content">
                  <input type="number" #width id="setting-row-input-width" [attr.placeholder]="'宽度'+unit[0]" [formControlName]="'width.'+unit[0]">
              </div>
              <span class="setting-row-input-unit">
                  {{unit[0]}}
              </span>
              <span (click)="clearValue('width.'+unit[0])" class="setting-row-input-unit">自动</span>
          </div>
          <div class="setting-row-input">
              <label class="setting-row-input-label" for="setting-row-input-height">
                  高度:
              </label>
              <div class="setting-row-input-content">
                  <input type="number" id="setting-row-input-height" placeholder="高度" formControlName="height.px">
              </div>
              <span class="setting-row-input-unit">px</span>
              <span (click)="clearValue('height.px')" class="setting-row-input-unit">自动</span>
          </div>
          <div class="setting-row-input">
              <label class="setting-row-input-label" for="setting-row-input-height">
                  行高:
              </label>
              <div class="setting-row-input-content">
                  <input type="number" id="setting-row-input-height" placeholder="行高" formControlName="line-height.px">
              </div>
              <span class="setting-row-input-unit">px</span>
              <span (click)="clearValue('line-height.px')" class="setting-row-input-unit">自动</span>
          </div>
      </div>
    `,
                styles: [`
      :host {
        display: block; }
    `]
            },] },
];
/**
 * @nocollapse
 */
ShareSizeComponent.ctorParameters = () => [];
ShareSizeComponent.propDecorators = {
    'props': [{ type: Input },],
    'unit': [{ type: Input },],
};

class ShareBackgroundComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl('background-image', '');
        this.checkControl('background-size', 'cover');
        this.checkControl('background-position', 'cover');
        this.checkControl('background-repeat', 'no-repeat');
    }
    /**
     * @param {?} e
     * @return {?}
     */
    backgroundImageChange(e) {
        this.props.get('background-image').setValue(`url(${e.target.value})`);
    }
}
ShareBackgroundComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-background',
                template: `
      <!-- <div class="setting-row" [formGroup]="props">
          <h1>背景设置</h1>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  图片:
              </div>
              <div class="setting-row-input-content">
                  <input type="text" (change)="backgroundImageChange($event)" [attr.value]="props.get('background-image').value">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  平铺:
              </div>
              <div class="setting-row-input-content">
                  <input type="text" [formControlName]="'background-repeat'">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  大小:
              </div>
              <div class="setting-row-input-content">
                  <input type="text" [formControlName]="'background-size'">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  位置:
              </div>
              <div class="setting-row-input-content">
                  <input type="text" [formControlName]="'background-position'">
              </div>
              <span class="setting-row-input-unit"></span>
          </div>
      </div> -->
    `
            },] },
];
/**
 * @nocollapse
 */
ShareBackgroundComponent.ctorParameters = () => [];

class ShareMarginComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ margin = this.props.get('margin').value;
        const [top, right, bottom, left] = margin.split(" ");
        this.checkControl('margin-top.px', this.pxToNumber(top));
        this.checkControl('margin-right.px', this.pxToNumber(right));
        this.checkControl('margin-bottom.px', this.pxToNumber(bottom));
        this.checkControl('margin-left.px', this.pxToNumber(left));
    }
}
ShareMarginComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-margin',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>外间距设置</h1>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  上间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="margin-top.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  右间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="margin-right.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  下间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="margin-bottom.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  左间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="margin-left.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
      </div>
    `,
                styles: [`
      :host {
        display: block; }
    `]
            },] },
];
/**
 * @nocollapse
 */
ShareMarginComponent.ctorParameters = () => [];

class SharePaddingComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl('padding', '0');
        const /** @type {?} */ margin = this.props.get('padding').value;
        const [top, right, bottom, left] = margin.split(" ");
        this.checkControl('padding-top.px', this.pxToNumber(top));
        this.checkControl('padding-right.px', this.pxToNumber(right));
        this.checkControl('padding-bottom.px', this.pxToNumber(bottom));
        this.checkControl('padding-left.px', this.pxToNumber(left));
    }
}
SharePaddingComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-padding',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>內间距设置</h1>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  上间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="padding-top.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  右间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="padding-right.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  下间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="padding-bottom.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  左间距:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="padding-left.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
      </div>
    `
            },] },
];
/**
 * @nocollapse
 */
SharePaddingComponent.ctorParameters = () => [];

class ShareBorderComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.props.contains('border')) {
            const /** @type {?} */ border = this.props.get('border').value;
            const [width, style, color] = border.split(' ');
            this.checkControl('border-top-width.px', this.pxToNumber(width));
            this.checkControl('border-right-width.px', this.pxToNumber(width));
            this.checkControl('border-bottom-width.px', this.pxToNumber(width));
            this.checkControl('border-left-width.px', this.pxToNumber(width));
            this.checkControl('border-color', color);
            this.checkControl('border-style', style);
        }
    }
}
ShareBorderComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-border',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>边框设置</h1>
          <div class="setting-row-input" *ngIf="props.contains('border-top-width.px')">
              <div class="setting-row-input-label">
                  上边框:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" min="0" step="1" formControlName="border-top-width.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input" *ngIf="props.contains('border-right-width.px')">
              <div class="setting-row-input-label">
                  右边框:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" min="0" step="1" formControlName="border-right-width.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input" *ngIf="props.contains('border-bottom-width.px')">
              <div class="setting-row-input-label">
                  下边框:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" min="0" step="1" formControlName="border-bottom-width.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
          <div class="setting-row-input" *ngIf="props.contains('border-left-width.px')">
              <div class="setting-row-input-label">
                  左边框:
              </div>
              <div class="setting-row-input-content">
                  <input type="number" min="0" step="1" formControlName="border-left-width.px">
              </div>
              <span class="setting-row-input-unit">px</span>
          </div>
      </div>
    `
            },] },
];
/**
 * @nocollapse
 */
ShareBorderComponent.ctorParameters = () => [];

class ShareSwiperComponent extends ControlBase {
    constructor() {
        super();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl('loop', 'true');
        this.checkControl('speed', '300');
        this.checkControl('delay', '3000');
        this.checkControl('effect', 'slide');
        this.checkControl('pagination', 'bullets');
    }
}
ShareSwiperComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-swiper',
                template: `
      <div class="setting-row" [formGroup]="props">
          <h1>滑动设置</h1>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  是否循环
              </div>
              <div class="setting-row-input-content">
                  <select formControlName="loop">
                      <option value="true">循环</option>
                      <option value="false">不循环</option>
                  </select>
              </div>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  速度
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="speed">
              </div>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  切换动画
              </div>
              <div class="setting-row-input-content">
                  <select formControlName="effect">
                      <option value="slide">slide</option>
                      <option value="fade">fade</option>
                      <option value="cube">cube</option>
                      <option value="coverflow">coverflow</option>
                      <option value="flip">flip</option>
                  </select>
              </div>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  自动播放
              </div>
              <div class="setting-row-input-content">
                  <input type="number" formControlName="delay">
              </div>
          </div>
          <div class="setting-row-input">
              <div class="setting-row-input-label">
                  页码
              </div>
              <div class="setting-row-input-content">
                  <select formControlName="pagination">
                      <option value="bullets">bullets</option>
                      <option value="fraction">fraction</option>
                      <option value="progressbar">progressbar</option>
                      <option value="custom">custom</option>
                  </select>
              </div>
          </div>
      </div>
    `
            },] },
];
/**
 * @nocollapse
 */
ShareSwiperComponent.ctorParameters = () => [];

class SharePositionComponent extends ControlBase {
    constructor() {
        super();
        this._noup = false;
        this._nodown = false;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set noup(val) {
        this._noup = true;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set nodown(val) {
        this._nodown = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkControl('position', 'relative');
        this.checkControl('left.px', '0');
        this.checkControl('right.px', '0');
        if (!this._noup) {
            this.checkControl('top.px', '0');
        }
        if (!this._nodown) {
            this.checkControl('bottom.px', '0');
        }
    }
}
SharePositionComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-position',
                template: `
      <div class="setting-row" [formGroup]="props">
              <h1>
                  定位
              </h1>
              <div class="setting-row-input" *ngIf="!_noup">
                  <div class="setting-row-input-label">
                      上:
                  </div>
                  <div class="setting-row-input-content">
                      <input type="number" formControlName="top.px">
                  </div>
                  <span class="setting-row-input-unit">px</span>
              </div>
              <div class="setting-row-input">
                  <div class="setting-row-input-label">
                      右:
                  </div>
                  <div class="setting-row-input-content">
                      <input type="number" formControlName="right.px">
                  </div>
                  <span class="setting-row-input-unit">px</span>
              </div>
              <div class="setting-row-input" *ngIf="!_nodown">
                  <div class="setting-row-input-label">
                      下:
                  </div>
                  <div class="setting-row-input-content">
                      <input type="number" formControlName="bottom.px">
                  </div>
                  <span class="setting-row-input-unit">px</span>
              </div>
              <div class="setting-row-input">
                  <div class="setting-row-input-label">
                      左:
                  </div>
                  <div class="setting-row-input-content">
                      <input type="number" formControlName="left.px">
                  </div>
                  <span class="setting-row-input-unit">px</span>
              </div>
          </div>
    `
            },] },
];
/**
 * @nocollapse
 */
SharePositionComponent.ctorParameters = () => [];
SharePositionComponent.propDecorators = {
    'noup': [{ type: Input },],
    'nodown': [{ type: Input },],
};

const shareComponents = [
    ShareColorComponent,
    ShareSizeComponent,
    ShareBackgroundComponent,
    ShareMarginComponent,
    SharePaddingComponent,
    SharePositionComponent,
    ShareBorderComponent,
    ShareSwiperComponent
];

class NgEachOfContext {
    /**
     * @param {?} $implicit
     * @param {?} ngEachOf
     * @param {?} key
     */
    constructor($implicit, ngEachOf, key) {
        this.$implicit = $implicit;
        this.ngEachOf = ngEachOf;
        this.key = key;
    }
}
class NgEachOf {
    /**
     * @param {?} _viewContainer
     * @param {?} _template
     * @param {?} _differs
     */
    constructor(_viewContainer, _template, _differs) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this._differ = null;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set ngForTemplate(value) {
        if (value) {
            this._template = value;
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._viewContainer.clear();
        if ('ngEachOf' in changes) {
            const /** @type {?} */ value = changes['ngEachOf'].currentValue;
            this._applyChanges(value);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    _applyChanges(changes) {
        for (const /** @type {?} */ key in changes) {
            const /** @type {?} */ item = changes[key];
            const /** @type {?} */ view = this._viewContainer.createEmbeddedView(this._template, new NgEachOfContext(item, this.ngEachOf, key), parseInt(key, 16));
        }
    }
}
NgEachOf.decorators = [
    { type: Directive, args: [{ selector: '[ngEach][ngEachOf]' },] },
];
/**
 * @nocollapse
 */
NgEachOf.ctorParameters = () => [
    { type: ViewContainerRef, },
    { type: TemplateRef, },
    { type: KeyValueDiffers, },
];
NgEachOf.propDecorators = {
    'ngEachOf': [{ type: Input },],
    'ngForTemplate': [{ type: Input },],
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
                imports: [
                    CommonModule,
                    ReactiveFormsModule
                ],
                exports: [
                    NgComponentDirective,
                    ...shareComponents,
                    NgEachOf
                ],
                declarations: [
                    NgComponentDirective,
                    ...shareComponents,
                    NgEachOf
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

export { IDesignComponentModule, NgComponentDirective, DesignApiService, DesignLibraryService, DESIGN_LIBRARYS, DesignPropsService, DESIGN_COMPONENTS, guid, ShareBackgroundComponent as ɵf, ControlBase as ɵd, ShareBorderComponent as ɵj, ShareColorComponent as ɵc, ShareMarginComponent as ɵg, SharePaddingComponent as ɵh, SharePositionComponent as ɵi, shareComponents as ɵb, ShareSizeComponent as ɵe, ShareSwiperComponent as ɵk, DRAG_DROP_ALL as ɵa, NgEachOf as ɵm, NgEachOfContext as ɵl };
//# sourceMappingURL=meepo-idesign-share.js.map
