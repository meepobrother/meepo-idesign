import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { Antd } from '../../antd';

@Directive({ selector: '[listRipple]' })
export class ListRippleDirective extends Antd {
    timer: any;
    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'list-ripple');
    }

    setAnimate(ev, RippleWidth) {
        const coverRippleStyle = {
            width: `${RippleWidth}px`,
            height: `${RippleWidth}px`,
            left: `${ev.x}px`,
            top: `${ev.y}px`,
            display: 'block'
        };
        this.setStyleObj(coverRippleStyle);
        this.addToClass('-animate', true);
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.back();
        }, 1000);
    }

    back() {
        this.setStyleObj({
            width: `0px`,
            height: `0px`,
            left: `0px`,
            top: `0px`,
            display: 'none'
        });
        this.addToClass('-animate', false);
    }
}
