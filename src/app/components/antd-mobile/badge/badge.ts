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
    selector: 'antd-badge',
    templateUrl: './badge.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./badge.less']
})
export class AntdBadgeComponent extends ReactComponent<AntdBadgeProps, any> implements AfterContentInit {
    scrollNumberCls: string;
    badgeCls: string;
    @HostBinding('class.am-badge') _badge: boolean = true;
    @HostBinding('class.am-badge-not-a-wrapper') _notAWrapper: boolean = false;
    @HostBinding('class.am-badge-corner-wrapper') _cornerWrapper: boolean = false;
    @HostBinding('class.am-badge-hot') _hot: boolean = false;
    @HostBinding('class.am-badge-corner-wrapper-large') _cornerWrapperLarge: boolean = false;

    constructor(
        private differs: KeyValueDiffers,
        ele: ElementRef,
        render: Renderer2
    ) {
        super(differs, ele, render);
    }

    ngAfterContentInit() {
        this.reactRender();
    }

    private reactRender() {
        const { children, prefixCls, dot, size, corner, hot, className, text } = this.props;
        this.props.text = typeof this.props.text === 'number'
            && this.props.text > this.props.overflowCount ?
            `${this.props.overflowCount}+` : this.props.text;
        this._cornerWrapper = this.props.corner;
        this._notAWrapper = !children;
        this._hot = !!this.props.hot;
        this._cornerWrapperLarge = this.props.corner && (this.props.size === 'large');
    }

    onStateChange(changes: KeyValueChanges<string, any>) {
        this.reactRender();
    }

    onPropsChange(changes: KeyValueChanges<string, any>) {
        this.reactRender();
    }
}
