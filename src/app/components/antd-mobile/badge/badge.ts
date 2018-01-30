import {
    Component, OnInit, KeyValueDiffers,
    ViewEncapsulation, HostBinding, KeyValueChanges,
    ContentChild, TemplateRef, AfterContentInit, ElementRef,
    Renderer2
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { ansycClassObj } from 'meepo-common';
import * as classnames from 'classnames';

export interface AntdBadgeProps {
    hot: boolean;// 营销样式
    prefixCls: string;
    className: string;
    size: 'large' | 'small';
    overflowCount: number;
    corner: boolean;
    dot: boolean;
    text: any;
    style: any;
    children: any[];
}

export class AntdBadgePropsDefault implements AntdBadgeProps {
    text = '';
    style = {};
    size: 'small' | 'large' = 'small';
    overflowCount = 99;
    dot = false;
    hot = false;
    corner = false;
    prefixCls = 'am-badge';
    className = '';
    children = [];
    constructor() { }
}
@Component({
    selector: 'am-badge',
    templateUrl: './badge.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./badge.less']
})
export class AntdBadgeComponent extends ReactComponent<any, any> implements AfterContentInit {
    scrollNumberCls: string;
    badgeCls: string;
    @HostBinding('class.am-badge-corner-wrapper') _corner: boolean = false;
    constructor(
        private differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(differs, ele, render);
    }

    ngAfterContentInit() {
        this.doChange();
    }

    private doChange() {
        this._corner = !!this.props.corner;
    }

    onStateChange(changes: KeyValueChanges<string, any>) {
        this.doChange();
    }

    onPropsChange(changes: KeyValueChanges<string, any>) {
        this.doChange();
    }
}
