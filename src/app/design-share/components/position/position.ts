import { Component, OnInit } from '@angular/core';
import { ControlBase } from '../base';

@Component({
    selector: 'share-position',
    templateUrl: './position.html'
})

export class SharePositionComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {
        this.checkControl('position', 'relative');
        this.checkControl('left.px', '0');
        this.checkControl('right.px', '0');
        this.checkControl('top.px', '0');
        this.checkControl('bottom.px', '0');
    }
}