import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'share-color',
    templateUrl: './color.html',
    styleUrls: ['./color.scss']
})
export class ShareColorComponent implements OnInit {
    @Input() props: FormGroup;
    constructor() { }
    ngOnInit() { }
}
