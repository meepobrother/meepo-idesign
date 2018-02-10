import { Component, OnInit, KeyValueDiffers, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

export interface MeepoMobileProps {
    children: any[];
}
export class MeepoMobileDefault implements MeepoMobileProps {
    children = [];
}
import { ReactComponent } from 'ng-react-component';
import { DesignPropsService, DesignLibraryProp, DesignApiService } from 'meepo-idesign-share';

@Component({
    selector: 'meepo-mobile-preview',
    templateUrl: './meepo-mobile-preview.html',
    styleUrls: ['./meepo-mobile-preview.scss']
})
export class MeepoMobilePreviewComponent extends ReactComponent<MeepoMobileProps, any> {
    constructor(
        _differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2,
        public _props: DesignPropsService
    ) {
        super(_differs, ele, render);
    }

    onPropsChange() { }

    onStateChange() { }
    
    ngOnInit() { 
        console.log(this.props);
    }

    _showMore(e: DesignLibraryProp) {
        console.log('显示操作提示');
    }

    addComponent(name: string) {
        this._props.addPropByName(name);
    }

    removeComponent(uuid: string) {
        this._props.removePropsByUid(uuid);
    }
}

