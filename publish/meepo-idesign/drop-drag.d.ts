import { ElementRef, Renderer2, OnInit, EventEmitter } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
export declare class CanDropDirective implements OnInit {
    private ele;
    private render;
    canDropChange: EventEmitter<any>;
    canDrop: any;
    constructor(ele: ElementRef, render: Renderer2);
    ngOnInit(): void;
}
export declare class CanDragDirective implements OnInit {
    private ele;
    private render;
    private view;
    _drop: boolean;
    canDrag: any;
    canDragChange: EventEmitter<any>;
    constructor(ele: ElementRef, render: Renderer2, view: ViewContainerRef);
    ngOnInit(): void;
}
