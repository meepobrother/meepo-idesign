import {
    Component, KeyValueDiffers,
    ElementRef, Renderer2, HostListener
} from '@angular/core';
import { ReactComponentSetting } from 'ng-react-component';
import { FormBuilder } from '@angular/forms';
import { DesignPropsService } from 'meepo-idesign-share';

@Component({
    selector: 'meepo-welcome-setting',
    templateUrl: './meepo-welcome-setting.html',
    styleUrls: ['./meepo-welcome-setting.scss']
})
export class MeepoWelcomeSettingComponent extends ReactComponentSetting<any, any> {
    element: HTMLElement;
    constructor(
        _differs: KeyValueDiffers,
        _ele: ElementRef,
        _render: Renderer2,
        _fb: FormBuilder,
        p: DesignPropsService
    ) {
        super(_differs, _ele, _render, _fb, p);
    }

    ngOnInit() {
        this.element = this.instance.ele.nativeElement;
        this.initStyleForm();
    }

    onPropsChange() { }

    onStateChange() {
        console.log(this.state);
    }
}
