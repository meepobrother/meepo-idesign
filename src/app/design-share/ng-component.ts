
import {
    ComponentFactoryResolver, ComponentRef, Directive,
    Injector, Input, NgModuleFactory, NgModuleRef,
    OnChanges, OnDestroy, SimpleChanges, StaticProvider,
    Type, ViewContainerRef, Output, OnInit, ComponentFactory,
    HostListener, EventEmitter, TemplateRef,
    IterableDiffers, NgIterable, IterableDiffer, IterableChangeRecord,
    IterableChanges, Renderer2
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DesignLibraryProp, DesignLibraryService, DesignPropsService } from './types';
import { KeyValueChanges } from '@angular/core';

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

    @Input() ngComponentClick: (sm: any) => {};

    instances: any[] = [];

    private _differ: IterableDiffer<any>;
    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _template: TemplateRef<any>,
        private differs: IterableDiffers,
        private librarys: DesignLibraryService,
        private props: DesignPropsService,
        private render: Renderer2
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
                if (designLibraryProp.props) {
                    componentRef.instance.props = designLibraryProp.props;
                }
                if (designLibraryProp.state) {
                    componentRef.instance.state = designLibraryProp.state;
                }
                componentRef.instance.onClick.subscribe(res => {
                    this.ngComponentClick && this.ngComponentClick(designLibraryProp)
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
                const instanceComponent = new InstanceComponent(componentRef.instance.guid, designLibraryProp);
                this.instances.push(instanceComponent);
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

    private setDrop(instance: ReactComponent<any, any>) {
        const ele = instance.ele.nativeElement;
        fromEvent(ele, 'drop').subscribe((ev: DragEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            var data = ev.dataTransfer.getData("name");
            var uuid = this.trimGuid(data);
            console.log(instance, data);
            if (!this.isGuid(data)) {
                // 获取props
                const props = this.props.getPropsByName(data);
                instance.props.children = instance.props.children || [];
                instance.props.children.push(props);
            } else if(uuid !== instance.guid){
                // 移动已存在props
                let props = this.getInstanceProps(uuid);
                if (props) {
                    instance.props.children.push(props);
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

export class InstanceComponent {
    constructor(
        public guid: string,
        public props: DesignLibraryProp
    ) { }
}