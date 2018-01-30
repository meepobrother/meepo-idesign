import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ControlBase } from '../base';

@Component({
    selector: 'share-background',
    templateUrl: './background.html'
})
export class ShareBackgroundComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }
    ngOnInit() {
        this.checkControl('background-size', 'cover');
        this.checkControl('background-position', 'cover');
        this.checkControl('background-repeat', 'no-repeat');
    }

    backgroundImageChange(e: any) {
        this.props.get('background-image').setValue(`url(${e.target.value})`);
    }
}
