import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ControlBase } from '../base';

@Component({
    selector: 'share-border',
    templateUrl: './border.html'
})
export class ShareBorderComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }
    ngOnInit() {
        if (this.props.contains('border')) {
            const border: string = this.props.get('border').value;
            const [width, style, color] = border.split(' ');
            this.checkControl('border-top-width.px', this.pxToNumber(width));
            this.checkControl('border-right-width.px', this.pxToNumber(width));
            this.checkControl('border-bottom-width.px', this.pxToNumber(width));
            this.checkControl('border-left-width.px', this.pxToNumber(width));
            this.checkControl('border-color', color);
            this.checkControl('border-style', style);
        }
    }
}
