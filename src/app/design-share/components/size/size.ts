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
        this.checkControl(`width${this.unit[0]}`, '100');
        this.checkControl(`height${this.unit[1]}`, '100');
    }
}
