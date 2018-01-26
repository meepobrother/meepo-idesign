import { TemplateRef, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
export declare class NoticeBarComponent implements AfterViewInit {
    noticeBarPrefixCls: string;
    action: TemplateRef<any>;
    icon: TemplateRef<any>;
    model: 'closeable' | 'link';
    fps: number;
    open: boolean;
    right: number;
    marquee: ElementRef;
    maxWidth: number;
    timeLen: number;
    onAction: EventEmitter<any>;
    constructor();
    ngAfterViewInit(): void;
    animation(): void;
    doAction(): void;
}
