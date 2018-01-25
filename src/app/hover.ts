import { Directive, HostBinding, Renderer2, ElementRef, OnInit, Inject } from '@angular/core';
import { HostListener } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { DOCUMENT } from '@angular/common';

import { takeUntil } from 'rxjs/operators/takeUntil';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';

@Directive({ selector: 'div[fxFlex]' })
export class FlexHoverDirective implements OnInit {
    @HostBinding('style.border') _border: String;
    @HostBinding('style.cursor') _cursor: String = 'pointer';


    constructor(
        private ele: ElementRef,
        private render: Renderer2,
        @Inject(DOCUMENT) private document: any
    ) { }

    translatePoint(e: MouseEvent) {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }

    translateMove(e: TouchEvent) {
        if (e.touches.length > 0) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }

    ngOnInit() {
        const mouseover = fromEvent(this.ele.nativeElement, 'mouseover')
            .pipe(map((res: any) => ({ type: 'mouseover', ...this.translatePoint(res) })));
        const mouseout = fromEvent(this.ele.nativeElement, 'mouseout')
            .pipe(map((res: any) => ({ type: 'mouseout', ...this.translatePoint(res) })));

        const mousedown = fromEvent(this.ele.nativeElement, 'mousedown')
            .pipe(map((res: any) => ({ type: 'mousedown', ...this.translatePoint(res) })));
        const mouseup = fromEvent(this.ele.nativeElement, 'mouseup')
            .pipe(map((res: any) => ({ type: 'mouseup', ...this.translatePoint(res) })));

        const mouseenter = fromEvent(this.ele.nativeElement, 'mouseenter')
            .pipe(map((res: any) => ({ type: 'mouseenter', ...this.translatePoint(res) })));
        const mouseleave = fromEvent(this.ele.nativeElement, 'mouseleave')
            .pipe(map((res: any) => ({ type: 'mouseleave', ...this.translatePoint(res) })));
        const mousemove = fromEvent(this.ele.nativeElement, 'mousemove')
            .pipe(map((res: any) => ({ type: 'mousemove', ...this.translatePoint(res) })));

        const touchstart = fromEvent(this.ele.nativeElement, 'touchstart')
            .pipe(map((res: any) => ({ type: 'touchstart', ...this.translateMove(res) })));
        const touchmove = fromEvent(this.ele.nativeElement, 'touchmove')
            .pipe(map((res: any) => ({ type: 'touchmove', ...this.translateMove(res) })));
        const touchend = fromEvent(this.ele.nativeElement, 'touchend')
            .pipe(map((res: any) => ({ type: 'touchend', ...this.translateMove(res) })));
        const touchcancel = fromEvent(this.ele.nativeElement, 'touchcancel')
            .pipe(map((res: any) => ({ type: 'touchcancel', ...this.translateMove(res) })));

        // merge(
        //     mouseover, mouseout,
        //     mousedown, mouseup,
        //     mouseenter, mouseleave, mousemove,
        //     touchstart, touchend, touchmove, touchcancel
        // ).subscribe((res: Object) => {
        //     console.log(res);
        // });

        createMouseMoving(this.document, this.render, this.ele.nativeElement).subscribe(res => {
            createMouseMovingStyle(this.ele.nativeElement, res);
        });
    }
}

export function createMouseMovingStyle(ele: HTMLElement, res: any) {
    const l = ele.offsetLeft;
    const t = ele.offsetTop;
    const offsetx = l + res.x;
    const offsety = t + res.y;

    ele.style.position = 'absolute';
    ele.style['left'] = offsetx + "px";
    ele.style['top'] = offsety + "px";
}


export function createMouseMoving(document: any, render: Renderer2, ele: HTMLElement) {
    createNoSelect(render, ele);
    const getMouseEventPosition = (event: MouseEvent) => ({
        x: event.movementX,
        y: event.movementY
    });
    /* tslint:disable */
    const mousedown$ = fromEvent(ele, 'mousedown').pipe(map(getMouseEventPosition));
    const mousemove$ = fromEvent(document, 'mousemove').pipe(map(getMouseEventPosition));
    const mouseup$ = fromEvent(document, 'mouseup').pipe(map(getMouseEventPosition));
    /* tslint:enable*/
    const drag = mousedown$.pipe(switchMap(_ => mousemove$.pipe(takeUntil(mouseup$))));
    return drag;
}

export function createNoSelect(render: Renderer2, ele: HTMLElement) {
    render.setAttribute(ele, 'unselectable', 'on');
    const styles = {
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    };
    for (const key in styles) {
        render.setStyle(ele, key, styles[key]);
    }
}

