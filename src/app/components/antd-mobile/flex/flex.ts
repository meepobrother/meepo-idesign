import {
    ViewEncapsulation, Component,
    Input, ElementRef, Renderer2,
    ChangeDetectionStrategy
} from '@angular/core';
import { Antd } from '../antd';
@Component({
    selector: '[flex],flex',
    templateUrl: './flex.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./flex.less', './patch.less']
})
export class FlexComponent extends Antd {
    @Input()
    set justify(val: 'center' | 'end' | 'between' | 'start' | 'around') {
        this.setClassObj('center,end,between,start,around', val, '-justify');
    }

    @Input()
    set align(val: 'start' | 'end' | 'baseline' | 'center' | 'stretch') {
        this.setClassObj('start,end,baseline,center,stretch', val, '-align');
    }

    @Input()
    set content(val: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch') {
        this.setClassObj('start,end,center,between,around,stretch', val, '-align-content');
    }

    @Input()
    set wrap(val: 'wrap-reverse' | 'wrap' | 'nowrap') {
        val = val || 'wrap';
        this.setClassObj('wrap-reverse,wrap,nowrap', val, '-');
    }

    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'flexbox');
    }
}
