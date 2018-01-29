import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'share-size',
    templateUrl: './size.html',
    styleUrls: ['./size.scss']
})
export class ShareSizeComponent implements OnInit {
    @Input() props: FormGroup;
    constructor() { }
    ngOnInit() { }
}
