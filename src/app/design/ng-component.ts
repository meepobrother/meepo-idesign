
import {
    ComponentFactoryResolver, ComponentRef, Directive,
    Injector, Input, NgModuleFactory, NgModuleRef,
    OnChanges, OnDestroy, SimpleChanges, StaticProvider,
    Type, ViewContainerRef, Output, OnInit, ComponentFactory
} from '@angular/core';

@Directive({ selector: '[ngComponent]' })
export class NgComponentDirective implements OnInit {
    viewContainerRef: any;
    componentRef: ComponentRef<any>;
    moduleRef: any;

    @Input() ngComponent: any;
    @Input() ngComponentInput: any;
    @Output() Output: any;

    constructor(_viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = _viewContainerRef;
    }

    ngOnInit() {
        // console.log(this.ngComponentInput);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.viewContainerRef.clear();
        this.componentRef = null;
        if (this.ngComponent) {
            const elInjector = this.viewContainerRef.parentInjector;
            const componentFactoryResolver: ComponentFactoryResolver = this.moduleRef ? this.moduleRef.componentFactoryResolver :
                elInjector.get(ComponentFactoryResolver);
            const componentFactory: ComponentFactory<any> =
                componentFactoryResolver.resolveComponentFactory(this.ngComponent);
            this.componentRef = this.viewContainerRef.createComponent(
                componentFactory,
                this.viewContainerRef.length,
                elInjector,
                this.ngComponent
            );
            this.componentRef.instance.props = this.ngComponentInput;
        }
    }
}
