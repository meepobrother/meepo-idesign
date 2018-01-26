import {
    ViewEncapsulation, Component, HostBinding,
    Input, ElementRef, Renderer2, ContentChild,
    TemplateRef
} from '@angular/core';
import { ListItemComponent } from '../list/list-item/list-item';

@Component({
    selector: 'radio',
    templateUrl: './radio.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./radio.less', './patch.less']
})
export class RadioComponent extends ListItemComponent {
    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render);
        this.addToClass('am-radio-item', true, false);
    }
}
