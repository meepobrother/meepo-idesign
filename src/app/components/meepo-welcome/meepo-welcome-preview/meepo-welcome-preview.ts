import { Component, OnInit, KeyValueDiffers, ElementRef, Renderer2 } from '@angular/core';

export interface MeepoWelcomeProps {
    children: any[];
}
export class MeepoWelcomeDefault implements MeepoWelcomeProps {
    children = [];
}
import { ReactComponent } from 'ng-react-component';

@Component({
    selector: 'meepo-welcome-preview',
    templateUrl: './meepo-welcome-preview.html',
    styleUrls: ['./meepo-welcome-preview.scss']
})
export class MeepoWelcomePreviewComponent extends ReactComponent<MeepoWelcomeProps, any> {
    constructor(
        _differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(_differs, ele, render);
    }
    ngOnInit() { }

    onPropsChange() { }

    onStateChange() { }
}

