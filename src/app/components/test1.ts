import { Component, OnInit, HostBinding, KeyValueDiffers } from '@angular/core';
import { ReactComponent } from 'ng-react-component';

export interface Test1Props {
    title?: string;
}
export interface Test1State {

}
@Component({
    selector: 'test1',
    template: `{{props.title}}`
})
export class Test1Component extends ReactComponent<Test1Props, Test1State> implements OnInit {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    ngOnInit() {
        this.props = this.props || {};
    }
    onPropsChange() { }
    onStateChange() { }
}


@Component({
    selector: 'test1',
    template: `<input [(ngModel)]="props.title">`
})
export class Test1SettingComponent extends ReactComponent<Test1Props, Test1State> implements OnInit {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    ngOnInit() {
        this.props = this.props || {};
    }
    onPropsChange() { }
    onStateChange() { }
}
