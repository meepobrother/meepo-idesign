import {
    Component, OnInit, KeyValueDiffers, HostBinding,
    HostListener, EventEmitter, Output, Renderer2, ElementRef
} from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import * as classnames from 'classnames';
import { ViewEncapsulation } from '@angular/core';

export interface AntdButtonProps {
    prefixCls?: string;
    className?: string;
    role?: string;
    inline?: boolean;
    icon?: string;
    activeClassName?: string;
    type?: 'primary' | 'warning' | 'ghost';
    size?: 'large' | 'small';
    activeStyle?: boolean | Object;
    disabled?: boolean;
    onClick?: (x?: any) => void;
    loading?: boolean;
    style?: any;
    text?: string;
}

@Component({
    selector: 'antd-button',
    templateUrl: './button.html',
    styleUrls: ['./button.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AntdButtonComponent extends ReactComponent<AntdButtonProps, any> implements OnInit {
    @HostBinding('class')
    get wrapCls() {
        const { prefixCls, type, className, size, inline, disabled, loading, icon } = this.props;
        const iconType: any = loading ? 'loading' : icon;
        return classnames(this.props.prefixCls, this.props.className, {
            [`${prefixCls}-primary`]: type === 'primary',
            [`${prefixCls}-ghost`]: type === 'ghost',
            [`${prefixCls}-warning`]: type === 'warning',
            [`${prefixCls}-small`]: size === 'small',
            [`${prefixCls}-inline`]: inline,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-icon`]: !!iconType,
        })
    }
    @HostBinding('attr.aria-disabled') _disabled: boolean = false;
    @HostBinding('attr.role') _role: string = 'button';
    @HostListener('click', ['$event'])
    _onClick() {
        this.onClick.emit();
    }
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    get _iconProps() {
        const iconType: any = this.props.loading ? 'loading' : this.props.icon;
        return {
            size: this.props.size === 'small' ? 'xxs' : 'md',
            className: `${this.props.className}-icon`,
            type: `${iconType}`
        };
    }
    constructor(differs: KeyValueDiffers, ele: ElementRef, render: Renderer2) {
        super(differs, ele, render);
    }

    ngOnInit() { }

    onStateChange() { }

    onPropsChange() { }

    reactRender() {

    }
}