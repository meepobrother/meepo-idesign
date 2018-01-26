import { Component, OnInit, KeyValueDiffers, ElementRef, Renderer2 } from '@angular/core';
import { ReactComponent } from 'ng-react-component';

@Component({
    selector: 'badge-setting',
    templateUrl: './badge-setting.html'
})
export class BadgeSettingComponent extends ReactComponent<any, any> implements OnInit {
    constructor(
        differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(differs, ele, render);
    }
    ngOnInit() { }
    onPropsChange() { }
    onStateChange() { }
}

