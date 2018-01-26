import {
    ViewEncapsulation, Component, ElementRef,
    Renderer2, ChangeDetectionStrategy
} from '@angular/core';
import { Antd } from '../../antd';
@Component({
    selector: '[flexItem],flex-item',
    templateUrl: './flex-item.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexItemComponent extends Antd {
    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'flexbox-item');
    }
}
