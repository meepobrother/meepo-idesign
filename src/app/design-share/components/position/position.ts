import { Component, OnInit, Input } from '@angular/core';
import { ControlBase } from '../base';

@Component({
    selector: 'share-position',
    templateUrl: './position.html'
})

export class SharePositionComponent extends ControlBase implements OnInit {
    _noup: boolean = false;
    @Input()
    set noup(val) {
        this._noup = true;
    }
    _nodown: boolean = false;
    @Input()
    set nodown(val) {
        this._nodown = true;
    }
    constructor() {
        super();
    }

    ngOnInit() {
        this.checkControl('position', 'relative');
        this.checkControl('left.px', '0');
        this.checkControl('right.px', '0');
        if (!this._noup) {
            this.checkControl('top.px', '0');
        }
        if (!this._nodown) {
            this.checkControl('bottom.px', '0');
        }
    }
}