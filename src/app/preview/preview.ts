import { Component, OnInit, KeyValueDiffers, ElementRef, Renderer2 } from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { DesignPropsService } from 'meepo-idesign-share';

@Component({
    selector: 'ipreview',
    templateUrl: './preview.html',
    styleUrls: ['./preview.scss']
})
export class IpreviewComponent extends ReactComponent<any, any> {
    constructor(
        differs: KeyValueDiffers,
        public history: DesignPropsService,
        render: Renderer2,
        ele: ElementRef
    ) {
        super(differs, ele, render);
    }
    ngOnInit() {
        this.history.backToHistory();
        const scale = window.screen.width / 414;
        const meta = `<meta name="viewport" content="width=414, initial-scale=${scale}">`;
        const metaElement: HTMLMetaElement = document.createElement('meta');
        metaElement.name = 'viewport';
        metaElement.content = `width=414, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=${scale}, user-scalable=false`;
        document.head.appendChild(metaElement);
    }
    onStateChange() { }
    onPropsChange() { }
}
