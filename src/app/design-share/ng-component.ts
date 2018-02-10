
import {
    ComponentFactoryResolver, ComponentRef, Directive,
    Injector, Input, NgModuleFactory, NgModuleRef,
    OnChanges, OnDestroy, SimpleChanges, StaticProvider,
    Type, ViewContainerRef, Output, OnInit, ComponentFactory,
    HostListener, EventEmitter, TemplateRef,
    IterableDiffers, NgIterable, IterableDiffer, IterableChangeRecord,
    IterableChanges, Renderer2, InjectionToken, Inject
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DesignLibraryProp, DesignLibraryService, DesignPropsService, DesignApiService } from './types';
import { KeyValueChanges } from '@angular/core';
import { guid } from './guid';
export const DRAG_DROP_ALL = new InjectionToken('DRAG_DROP_ALL');
@Directive({ selector: '[ngComponent]' })
export class NgComponentDirective implements OnChanges {
    viewContainerRef: ViewContainerRef;
    componentRef: ComponentRef<ReactComponent<any, any>>;
    moduleRef: any;
    // 组件列表
    @Input() ngComponent: NgIterable<DesignLibraryProp>;
    // 是否预览
    @Input() ngComponentPreview: boolean;
    // state
    @Input() ngComponentState: any;
    // class
    @Input() ngComponentClass: any;
    // style
    @Input() ngComponentStyle: any;
    // 是否可以拖拽
    @Input() ngComponentDrag: any;
    // 是否可以放置
    @Input() ngComponentDrop: any;
    @Input() ngComponentInstance: any;

    @Input() ngComponentClick: (sm: any, instance: any) => {};

    instances: any[] = [];

    private _differ: IterableDiffer<any>;
    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _template: TemplateRef<any>,
        private differs: IterableDiffers,
        private librarys: DesignLibraryService,
        private api: DesignApiService,
        private props: DesignPropsService,
        private render: Renderer2,
        @Inject(DRAG_DROP_ALL) private dragDropAll: boolean
    ) {
        this.viewContainerRef = _viewContainerRef;
    }

    ngDoCheck(): void {
        if (this._differ) {
            const changes = this._differ.diff(this.ngComponent);
            if (changes) {
                changes.forEachOperation((item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
                    if (item.previousIndex == null) {
                        this.createComponent(item, currentIndex);
                    } else if (currentIndex == null) {
                        this._viewContainerRef.remove(adjustedPreviousIndex);
                    } else {
                        const view = this._viewContainerRef.get(adjustedPreviousIndex)!;
                        this._viewContainerRef.move(view, currentIndex);
                    }
                });
            }
        }
    }

    private createComponent(item: IterableChangeRecord<DesignLibraryProp>, currentIndex) {
        try {
            const designLibraryProp: DesignLibraryProp = item.item;
            if (designLibraryProp) {
                let component: Type<any>;
                const libs = this.librarys.get(designLibraryProp.name);
                if (this.ngComponentPreview) {
                    component = libs.view;
                } else {
                    component = libs.setting;
                }
                const elInjector = this.viewContainerRef.parentInjector;
                const componentFactoryResolver: ComponentFactoryResolver = this.moduleRef ? this.moduleRef.componentFactoryResolver :
                    elInjector.get(ComponentFactoryResolver);
                const componentFactory: ComponentFactory<any> =
                    componentFactoryResolver.resolveComponentFactory(component);
                const componentRef = this.viewContainerRef.createComponent<ReactComponent<any, any>>(
                    componentFactory,
                    currentIndex,
                    elInjector
                );
                // designLibraryProp.props = JSON.parse(JSON.stringify(designLibraryProp.props));
                const { instance } = componentRef;
                if (designLibraryProp.props) {
                    instance.props = designLibraryProp.props;
                }
                if (designLibraryProp.state) {
                    instance.state = designLibraryProp.state;
                }
                if (instance.onClick && instance.onClick.subscribe) {
                    instance.onClick.subscribe((ev: MouseEvent) => {
                        if (this.ngComponentPreview) {
                            this.props.setActiveSettingProps(designLibraryProp, instance);
                            ev.stopPropagation();
                        }
                    });
                }
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
                } else {
                    designLibraryProp.uuid = instance.guid = guid();
                }
                this.api.save(instance, designLibraryProp, this.ngComponentPreview);
            }
        } catch (err) {
            console.log(`${this.ngComponentPreview ? 'preview' : 'setting'} is not fond`, item);
            console.dir(err);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.viewContainerRef.clear();
        if ('ngComponent' in changes) {
            const value = changes['ngComponent'].currentValue;
            if (value && !this._differ) {
                try {
                    this._differ = this.differs.find(value).create()
                } catch (err) { }
            }
        }
    }

    private setDrage(instance: ReactComponent<any, any>) {
        instance.setAttribute({
            draggable: true
        });
        const ele = instance.ele.nativeElement;
        let uuid: string;
        fromEvent(ele, 'dragstart').subscribe((ev: DragEvent) => {
            uuid = instance.guid;
            ev.dataTransfer.setData("name", 'guid_' + instance.guid);
            ev.stopPropagation();
        });
        fromEvent(ele, 'dragend').subscribe((ev: DragEvent) => {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    }

    private isGuid(name: string) {
        return name.indexOf('guid_') > -1;
    }

    private trimGuid(name: string) {
        return name.replace('guid_', '');
    }

    private deepCopy(obj: any) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (err) {
            console.dir(err);
            return {};
        }
    }

    private setDrop(instance: ReactComponent<any, any>) {
        const ele = instance.ele.nativeElement;
        fromEvent(ele, 'drop').subscribe((ev: DragEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            var data = ev.dataTransfer.getData("name");
            var uuid = this.trimGuid(data);
            if (!this.isGuid(data)) {
                // 获取props
                const props = this.props.getPropsByName(data);
                instance.props.children = instance.props.children || [];
                const deepProps = this.deepCopy(props);
                // 记录上级
                deepProps.father = instance.guid;
                instance.props.children.push(deepProps);
                this.props.instance.props.children.push(deepProps)
            } else if (uuid !== instance.guid) {
                // 移动已存在props
                let props = this.getInstanceProps(uuid);
                if (props) {
                    const deepProps = this.deepCopy(props);
                    deepProps.father = instance.guid;
                    instance.props.children.push(deepProps);
                }
            }
        });
        fromEvent(ele, 'dragleave').subscribe((ev: DragEvent) => {
            // dragend 删除这一个
            this.render.removeStyle(ele, 'dashed');
            ev.preventDefault();
            ev.stopPropagation();
        });
        fromEvent(ele, 'dragover').subscribe((ev: DragEvent) => {
            this.render.setStyle(ele, 'dashed', '1px lodash red');
            ev.preventDefault();
            ev.stopPropagation();
        });
    }

    private getInstanceProps(uuid: string) {
        let props: DesignLibraryProp;
        this.instances.map(res => {
            if (res.guid === uuid) {
                props = res.props;
            }
        });
        return props;
    }
}

