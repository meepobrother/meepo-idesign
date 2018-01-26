import {
    ViewEncapsulation, Component, HostBinding, Input,
    ChangeDetectorRef, OnChanges, SimpleChanges,
    ElementRef, Renderer2, ContentChild, TemplateRef,
    HostListener, ViewChild, EventEmitter, Output
} from '@angular/core';
import { fromEvent, isMeepoTrue, merge } from 'meepo-common';
import { listPrefixCls } from '../var';
import { Antd } from '../../antd';
import { ListRippleDirective } from '../list-ripple/list-ripple';
@Component({
    selector: 'list-item,[listItem]',
    templateUrl: './list-item.html',
    encapsulation: ViewEncapsulation.None
})
export class ListItemComponent extends Antd {
    @ContentChild('thumb') thumbRef: TemplateRef<any>;
    @ContentChild('brief') brief: TemplateRef<any>;

    _multiple: boolean = false;
    @Input()
    set multiple(val) {
        this._multiple = this.isMeepoTrue(val);
        this.addToClass('-multiple', isMeepoTrue(val));
    }

    @Input()
    set disabled(val: any) {
        this.addToClass('-disabled', isMeepoTrue(val));
    }

    @Input()
    set error(val: any) {
        this.addToClass('-error', isMeepoTrue(val));
    }

    @Input()
    set top(val: any) {
        this.addToClass('-top', isMeepoTrue(val));
    }

    @Input()
    set middle(val: any) {
        this.addToClass('-middle', isMeepoTrue(val));
    }

    @Input()
    set bottom(val: any) {
        this.addToClass('-bottom', isMeepoTrue(val));
    }

    _thumb: string;
    @Input()
    set thumb(val: string) {
        this._thumb = val;
    }

    @Input() extra: string | TemplateRef<any>;
    get extraType() {
        return typeof this.extra;
    }

    _arrow: string;
    @Input()
    set arrow(val: 'horizontal' | 'up' | 'down' | 'empty') {
        val = val || 'horizontal';
        this._arrow = val;
    }

    // new
    @ViewChild(ListRippleDirective) listRipple: ListRippleDirective;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @HostListener('click', ['$event'])
    click(e) {
        this.onClick.emit();
    }

    @HostListener('touchstart', ['$event'])
    touchstart(e) {
        this.setItemActive(true);
    }

    @HostListener('touchend', ['$event'])
    touchend() {
        this.setItemActive(false);
    }

    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'list-item');
        this.addToClass('-middle', true);
        this.initRipple();
    }

    initRipple() {
        const start$ = merge(
            fromEvent(this.ele.nativeElement, 'mousedown'),
            fromEvent(this.ele.nativeElement, 'touchstart')
        );
        start$
            .map((e: any) => {
                const Item = this.ele.nativeElement;
                const ClientRect = e.currentTarget.getBoundingClientRect();
                const res = this._getPosition(e);
                const pointX = res.y - ClientRect.left - Item.offsetWidth / 2;
                const pointY = res.y - ClientRect.top - Item.offsetWidth / 2;
                return { x: pointX, y: pointY }
            })
            .subscribe(res => {
                const Item = this.ele.nativeElement;
                const RippleWidth = Math.max(Item.offsetHeight, Item.offsetWidth);
                this.listRipple && this.listRipple.setAnimate(res, RippleWidth);
            });
    }

    setItemActive(isTrue?: boolean) {
        this.addToClass('-active', isTrue);
    }
}
