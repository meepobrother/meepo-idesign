import {
    Component, OnInit, HostBinding,
    KeyValueDiffers, ElementRef, Renderer2
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';

export interface Test1Props {
    title?: string;
    children: any[];
}
export interface Test1State {
    children: any[];
}
@Component({
    selector: 'test2',
    template: `{{props.title}}`
})
export class Test2Component extends ReactComponent<Test1Props, Test1State> implements OnInit {
    constructor(
        differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(differs, ele, render);
    }
    ngOnInit() {
        this.props = this.props || {} as Test1Props;
    }
    onPropsChange() { }
    onStateChange() { }
}


@Component({
    selector: 'test2',
    template: `<input [(ngModel)]="props.title">`
})
export class Test2SettingComponent extends ReactComponent<Test1Props, Test1State> implements OnInit {
    constructor(
        differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(differs, ele, render);
    }
    ngOnInit() {
        this.props = this.props || {} as Test1Props;
    }
    onPropsChange() { }
    onStateChange() { }
}
