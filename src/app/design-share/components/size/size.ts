import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlBase } from '../base';

@Component({
    selector: 'share-size',
    templateUrl: './size.html',
    styleUrls: ['./size.scss']
})
export class ShareSizeComponent extends ControlBase implements OnInit {
    @Input() props: FormGroup;
    @Input() unit: string[] = ['%', 'px']
    constructor() {
        super();
    }
    ngOnInit() {
        this.checkControl(`width.${this.unit[0]}`, '100');
        this.checkControl(`height.px`, '50');
        this.checkControl(`line-height.px`, '50');
        this.checkControl(`min-height.px`, '50');
        this.checkControl(`min-width.${this.unit[0]}`, '100');
        try {
            this.props.controls['height.px'].valueChanges.subscribe(res => {
                this.props.controls['line-height.px'].setValue(res);
                this.props.controls['min-height.px'].setValue(res);
            });
            this.props.controls[`width.${this.unit[0]}`].valueChanges.subscribe(res => {
                this.props.controls[`min-width.${this.unit[0]}`].setValue(res);
            });
        } catch (err) {
            console.log(this.props.get('height.px'))
        }
    }

    clearValue(name: string) {
        this.props.controls[name].setValue(null);
    }
}
