import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ControlBase } from '../base';

@Component({
    selector: 'share-margin',
    templateUrl: './margin.html',
    styleUrls: ['./margin.scss']
})
export class ShareMarginComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }
    ngOnInit() {
        const margin: string = this.props.get('margin').value;
        const [top, right, bottom, left] = margin.split(" ");
        this.checkControl('margin-top.px', this.pxToNumber(top));
        this.checkControl('margin-right.px', this.pxToNumber(right));
        this.checkControl('margin-bottom.px', this.pxToNumber(bottom));
        this.checkControl('margin-left.px', this.pxToNumber(left));
    }
}
