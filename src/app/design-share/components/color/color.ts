import { Component, OnInit, Input } from '@angular/core';
import { ControlBase } from '../base';
@Component({
    selector: 'share-color',
    templateUrl: './color.html',
    styleUrls: ['./color.scss']
})
export class ShareColorComponent extends ControlBase implements OnInit {
    constructor() { 
        super();
    }
    ngOnInit() {
        this.checkControl('color', '#fff');
        this.checkControl('background-color', 'gray');
    }
}
