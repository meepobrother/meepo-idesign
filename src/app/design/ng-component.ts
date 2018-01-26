
import {
    ComponentFactoryResolver, ComponentRef, Directive,
    Injector, Input, NgModuleFactory, NgModuleRef,
    OnChanges, OnDestroy, SimpleChanges, StaticProvider,
    Type, ViewContainerRef, Output, OnInit, ComponentFactory,
    HostListener, EventEmitter, TemplateRef,
    IterableDiffers, NgIterable, IterableDiffer, IterableChangeRecord,
    IterableChanges
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { fromEvent } from 'meepo-common';
import { DesignLibraryProp } from './types';
import { DesignService } from './design.service';
import { KeyValueChanges } from '@angular/core';
@Directive({ selector: '[ngComponent]' })
export class NgComponentDirective implements OnChanges {
    viewContainerRef: ViewContainerRef;
    componentRef: ComponentRef<ReactComponent<any, any>>;
    moduleRef: any;
    @Input() ngComponent: NgIterable<DesignLibraryProp>;

    @Input() ngComponentPreview: boolean;
    @Input() ngComponentState: any;
    @Input() ngComponentClass: any;
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
        private history: DesignService
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
            const props: DesignLibraryProp = item.item;
            let component: Type<any>;
            if (this.ngComponentPreview) {
                component = props.preview.component;
            } else {
                component = props.setting.component;
            }
            const elInjector = this.viewContainerRef.parentInjector;
            const componentFactoryResolver: ComponentFactoryResolver = this.moduleRef ? this.moduleRef.componentFactoryResolver :
                elInjector.get(ComponentFactoryResolver);
            const componentFactory: ComponentFactory<any> =
                componentFactoryResolver.resolveComponentFactory(component);
            const componentRef = this.viewContainerRef.createComponent(
                componentFactory,
                currentIndex,
                elInjector
            );
            componentRef.instance.props = props.props;
            componentRef.instance.onClick.subscribe(res => {
                this.ngComponentClick && this.ngComponentClick(props)
            });
            componentRef.instance.setClass(this.ngComponentClass);
            componentRef.instance.setStyle(this.ngComponentStyle);

            this.setDrage(componentRef.instance);
            this.setDrop(componentRef.instance);
            props.uuid = componentRef.instance.guid;
            const instanceComponent = new InstanceComponent(componentRef.instance.guid, props);
            this.instances.push(instanceComponent);
        } catch (err) { }
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
            ev.dataTransfer.setData("name", instance.guid);
        });
        fromEvent(ele, 'dragleave').subscribe((ev: DragEvent) => {
            // dragend 删除这一个
        });
        fromEvent(ele, 'dragend').subscribe((ev: DragEvent) => {
            // dragend 删除这一个
            // this.history.removeComponentByUuid(uuid);
        });
    }

    private setDrop(instance: ReactComponent<any, any>) {
        const ele = instance.ele.nativeElement;
        fromEvent(ele, 'drop').subscribe((ev: DragEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            var data = ev.dataTransfer.getData("name");
            if (instance.guid !== data) {
                // 自己放置自己 忽略 否则提示是放入内部还是互换位置
                let props = this.getInstanceProps(data);
                if (props) {
                    instance.props.children.push(props);
                    this.history.removeComponentByUuid(data);
                }
            }
        });
        fromEvent(ele, 'dragover').subscribe((ev: DragEvent) => {
            ele.style.bor
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