import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ControlBase } from '../base';

@Component({
    selector: 'share-padding',
    templateUrl: './padding.html'
})
export class SharePaddingComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }
    ngOnInit() {
        this.checkControl('padding', '0');
        const margin: string = this.props.get('padding').value;
        const [top, right, bottom, left] = margin.split(" ");
        this.checkControl('padding-top.px', this.pxToNumber(top));
        this.checkControl('padding-right.px', this.pxToNumber(right));
        this.checkControl('padding-bottom.px', this.pxToNumber(bottom));
        this.checkControl('padding-left.px', this.pxToNumber(left));
    }
}
