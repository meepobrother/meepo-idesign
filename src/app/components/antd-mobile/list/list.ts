import {
    ViewEncapsulation, Component, HostBinding,
    Input, ElementRef, Renderer2, ContentChild,
    TemplateRef
} from '@angular/core';
import { isMeepoTrue } from 'meepo-common';

import { listPrefixCls } from './var';
import { Antd } from '../antd';
@Component({
    selector: '[list],list',
    templateUrl: './list.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list.less', './patch.less']
})
export class ListComponent extends Antd {
    @ContentChild('header') header: TemplateRef<any>;
    @ContentChild('footer') footer: TemplateRef<any>;

    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'list');
    }
}
