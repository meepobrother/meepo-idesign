import { ComponentRef, OnChanges, SimpleChanges, ViewContainerRef, TemplateRef, IterableDiffers, NgIterable } from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { DesignLibraryProp, DesignLibraryService } from './types';
export declare class NgComponentDirective implements OnChanges {
    private _viewContainerRef;
    private _template;
    private differs;
    private librarys;
    viewContainerRef: ViewContainerRef;
    componentRef: ComponentRef<ReactComponent<any, any>>;
    moduleRef: any;
    ngComponent: NgIterable<DesignLibraryProp>;
    ngComponentPreview: boolean;
    ngComponentState: any;
    ngComponentClass: any;
    ngComponentStyle: any;
    ngComponentDrag: any;
    ngComponentDrop: any;
    ngComponentClick: (sm: any) => {};
    instances: any[];
    private _differ;
    constructor(_viewContainerRef: ViewContainerRef, _template: TemplateRef<any>, differs: IterableDiffers, librarys: DesignLibraryService);
    ngDoCheck(): void;
    private createComponent(item, currentIndex);
    ngOnChanges(changes: SimpleChanges): void;
    private setDrage(instance);
    private setDrop(instance);
    private getInstanceProps(uuid);
}
export declare class InstanceComponent {
    guid: string;
    props: DesignLibraryProp;
    constructor(guid: string, props: DesignLibraryProp);
}
