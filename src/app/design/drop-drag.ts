import {
    Directive, Component, ElementRef, Renderer2,
    OnInit, EventEmitter, TemplateRef
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { HostBinding } from '@angular/core';
import { ViewContainerRef, ComponentRef, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { switchMap } from 'rxjs/operators/switchMap';

@Directive({ selector: '[canDrop]' })
export class CanDropDirective implements OnInit {
    @Output() canDropChange: EventEmitter<any> = new EventEmitter();
    @Input() canDrop: any;
    constructor(
        private ele: ElementRef,
        private render: Renderer2
    ) { }

    ngOnInit() {
        fromEvent(this.ele.nativeElement, 'drop').subscribe((ev: DragEvent) => {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("name");
            this.canDropChange.emit(data);
        });
        fromEvent(this.ele.nativeElement, 'dragover').subscribe((ev: DragEvent) => {
            ev.preventDefault();
        });
    }
}


@Directive({ selector: '[canDrag]' })
export class CanDragDirective implements OnInit {
    @HostBinding('attr.draggable') _drop: boolean = true;
    @Input() canDrag: any;
    @Output() canDragChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private ele: ElementRef,
        private render: Renderer2,
        private view: ViewContainerRef
    ) { }

    ngOnInit() {
        fromEvent(this.ele.nativeElement, 'dragstart').subscribe((ev: DragEvent) => {
            ev.dataTransfer.setData("name", this.canDrag);
        });
        fromEvent(this.ele.nativeElement, 'dragend').subscribe(res => {
            this.canDragChange.emit(this.canDrag);
        });
    }
}

