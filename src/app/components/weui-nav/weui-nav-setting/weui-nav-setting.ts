import {
    Component, KeyValueDiffers,
    ElementRef, Renderer2, HostListener
} from '@angular/core';
import { ReactComponentSetting } from 'ng-react-component';
import { FormBuilder } from '@angular/forms';
import { DesignPropsService } from 'meepo-idesign-share';

@Component({
    selector: 'weui-nav-setting',
    templateUrl: './weui-nav-setting.html',
    styleUrls: ['./weui-nav-setting.scss']
})
export class WeuiNavSettingComponent extends ReactComponentSetting<any, any> {
    element: any;
    constructor(
        _differs: KeyValueDiffers,
        _ele: ElementRef,
        _render: Renderer2,
        _fb: FormBuilder,
        _p: DesignPropsService
    ) {
        super(_differs, _ele, _render, _fb, _p);
    }

    ngOnInit(){
        this.initStyleForm();
    }

    onPropsChange() { }

    onStateChange() {
        console.log(this.state);
    }
}

