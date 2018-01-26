import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { Antd } from '../../antd';
@Directive({ selector: '[listArrow]' })
export class ListArrowDirective extends Antd {
    @Input()
    set listArrow(val: string) {
        val = val || 'horizontal';
        this.addToClass('-' + val, true);
    }

    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'list-arrow');
        this.setStyle('visibility', 'visible');
    }
}
