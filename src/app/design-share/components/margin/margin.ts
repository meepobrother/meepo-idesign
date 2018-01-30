import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'share-margin',
    templateUrl: './margin.html'
})
export class ShareMarginComponent implements OnInit {
    @ViewChild('top') top: ElementRef;
    @ViewChild('right') right: ElementRef;
    @ViewChild('bottom') bottom: ElementRef;
    @ViewChild('left') left: ElementRef;
    @Input() form: FormGroup;

    constructor() { }

    ngOnInit() {
        combineLatest(
            fromEvent(this.top.nativeElement, 'change'),
            fromEvent(this.right.nativeElement, 'change'),
            fromEvent(this.bottom.nativeElement, 'change'),
            fromEvent(this.left.nativeElement, 'change')
        ).map(res => {
            console.log(res);
        });
    }
}
