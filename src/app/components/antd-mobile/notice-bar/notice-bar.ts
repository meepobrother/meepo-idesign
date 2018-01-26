import {
    Component, OnInit, ViewEncapsulation,
    HostBinding, Input, ContentChild, TemplateRef,
    EventEmitter, Output, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { noticeBarPrefixCls } from './val';
import { ansycClassObj, merge, setClassObj, isMeepoTrue } from 'meepo-common';

@Component({
    selector: 'notice-bar',
    templateUrl: './notice-bar.html',
    styleUrls: ['./notice-bar.less', './patch.less'],
    encapsulation: ViewEncapsulation.None
})
export class NoticeBarComponent implements AfterViewInit {
    noticeBarPrefixCls: string = noticeBarPrefixCls;
    @ContentChild('action') action: TemplateRef<any>;
    @ContentChild('icon') icon: TemplateRef<any>;

    @Input() model: 'closeable' | 'link';
    @Input() fps: number = 40;
    open: boolean = true;
    right: number = 0;

    @ViewChild('marquee') marquee: ElementRef;
    maxWidth: number = 0;
    timeLen: number = 0;
    @Output() onAction: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngAfterViewInit() {
        this.maxWidth = this.marquee.nativeElement.clientWidth - this.marquee.nativeElement.parentElement.clientWidth + 5;
        this.timeLen = 1 / this.fps! * 1000;
        this.animation();
    }

    animation() {
        setTimeout(() => {
            if (this.right < this.maxWidth) {
                this.right++;
                this.animation();
            } else {
                setTimeout(() => {
                    this.right = 0;
                    this.animation();
                }, this.timeLen * 80);
            }
        }, this.timeLen);
    }

    doAction() {
        if (this.model === 'closeable') {
            this.open = false;
        }
        this.onAction.emit();
    }
}
