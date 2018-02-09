import {
    Component, KeyValueDiffers,
    ElementRef, Renderer2, HostListener
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
export interface WeuiNavProps { }
export class WeuiNavDefault { 
    style = {
        position: 'absolute'
    }
}
@Component({
    selector: 'weui-nav-preview',
    templateUrl: './weui-navpreview.html',
    styleUrls: ['./weui-navpreview.scss']
})
export class WeuiNavPreviewComponent extends ReactComponent<any, any> {
    constructor(
        _differs: KeyValueDiffers,
        _ele: ElementRef,
        _render: Renderer2
    ) {
        super(_differs, _ele, _render);
    }

    onPropsChange() { }

    onStateChange() {
        console.log(this.state);
    }
}
