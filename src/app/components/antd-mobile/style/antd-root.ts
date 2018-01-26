import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'antd-root',
    template: `<ng-content></ng-content>`
})

export class AntdRootComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
