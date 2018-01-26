import {
    ViewEncapsulation, Component,
    Input, ElementRef, Renderer2,
    ChangeDetectionStrategy,
    ContentChild, TemplateRef,
    NgZone, OnInit, HostBinding,
    ContentChildren, QueryList,
    EventEmitter, Output, ViewChild,
    AfterContentInit, ChangeDetectorRef
} from '@angular/core';
import { Antd } from '../antd';
import { ScrollDispatcher, CdkScrollable, ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { isMeepoTrue, Scroller } from 'meepo-common';
const listView = 'am-list-view';
@Component({
    selector: 'list-view',
    templateUrl: './list-view.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./list-view.less', './patch.less']
})
export class ListViewComponent extends CdkScrollable implements OnInit, AfterContentInit {

    @Output() onScroll: EventEmitter<any> = new EventEmitter();
    @Output() onEndReached: EventEmitter<any> = new EventEmitter();
    @Output() onTopReached: EventEmitter<any> = new EventEmitter();

    // 试图
    ruler: ViewportRuler;
    // 高度控制
    @HostBinding('style.height.px')
    @Input()
    height: number = 0;
    // 下拉刷新
    @Input() pullToRefresh: boolean = false;
    // 是否水平
    _horizontal: boolean = false;
    @Input()
    set horizontal(val: any) {
        this._horizontal = isMeepoTrue(val);
    }
    get horizontal() {
        return this._horizontal;
    }
    // 滑动监听延时
    @Input() scrollEventThrottle: number = 50;
    // 延时执行
    @Input() onEndReachedThreshold: number = 1000;
    // 距离底部多少触发
    @Input() scrollRenderAheadDistance: number = 70;

    // 页码及数量
    @Input() page: number = 1;
    @Input() pageSize: number = 10;
    // 初始数量
    @Input() initialListSize: boolean;
    // 数据加载器
    @Input() dataSource: any;

    _viewportSize: any;
    contentScroller: Scroller;
    scroller: Scroller;

    @Input() loading: boolean = false;
    @ViewChild('content') content: ElementRef;

    constructor(
        public ele: ElementRef,
        _scroll: ScrollDispatcher,
        private ngZone: NgZone,
        public render: Renderer2,
        ruler: ViewportRuler,
        public cd: ChangeDetectorRef
    ) {
        super(ele, _scroll, ngZone);
        this.ruler = ruler;
    }

    ngAfterContentInit() {
        if (this.horizontal && !this.height) {
            this.height = this.content.nativeElement.firstChild.clientHeight + 5;
        }
    }

    ngOnInit() {
        // 内容区
        this.contentScroller = new Scroller(this.content);
        // 容器区
        this.scroller = new Scroller(this.ele);
        this.render.addClass(this.ele.nativeElement, `${listView}-scrollview`);
        // 监听滑动
        this.elementScrolled()
            .debounceTime(this.scrollEventThrottle)
            // 处理数据
            .map(res => {
                const content = this.contentScroller.getViewportRect();
                const scroller = this.scroller.getViewportRect();
                return {
                    top: content.top,
                    right: content.width - content.left - scroller.width,
                    bottom: content.height - content.top - scroller.height,
                    left: content.left,
                }
            })
            .do(res => {
                this.onScroll.emit(res);
            })
            // 过滤不符合的条件
            .filter(res => {
                let data: boolean = false;
                const maxHeight = this.scrollRenderAheadDistance;
                if (this.horizontal) {
                    // 如果水平
                    if (this.pullToRefresh) {
                        // 有刷新 返回左右值
                        data = res.left < maxHeight || res.right < maxHeight;
                    } else {
                        // 没有刷新
                        data = res.right < maxHeight;
                    }
                } else {
                    // 垂直
                    if (this.pullToRefresh) {
                        // 有刷新 返回上下值
                        data = res.top < maxHeight || res.bottom < maxHeight;
                    } else {
                        // 没有刷新
                        data = res.bottom < maxHeight;
                    }
                }
                return data;
            })
            .map(res => {
                const data = {
                    top: res.top < this.scrollRenderAheadDistance,
                    right: res.right < this.scrollRenderAheadDistance,
                    bottom: res.bottom < this.scrollRenderAheadDistance,
                    left: res.left < this.scrollRenderAheadDistance,
                }
                if (this.pullToRefresh) {
                    if (this.horizontal) {
                        return {
                            refresh: data.left,
                            more: data.right
                        }
                    } else {
                        return {
                            refresh: data.top,
                            more: data.bottom
                        }
                    }
                } else {
                    if (this.horizontal) {
                        return {
                            refresh: false,
                            more: data.right
                        }
                    } else {
                        return {
                            refresh: false,
                            more: data.bottom
                        }
                    }
                }
            })
            // 延时
            .subscribe(res => {
                if (!this.loading) {
                    if (res.refresh) {
                        this.onTopReached.emit(this);
                    }
                    if (res.more) {
                        this.onEndReached.emit(this);
                    }
                    this.loading = true;
                    this.markForCheck();
                    setTimeout(() => {
                        this.loading = false;
                        this.markForCheck();
                    }, this.onEndReachedThreshold);
                }
            });
        // 试图变化
        this.ruler.change().subscribe(res => {
            this.refreshSize();
        });
        super.ngOnInit();
    }

    markForCheck() {
        this.ngZone.run(() => {
            this.cd.markForCheck();
        });
    }

    contentRect: any;
    scrollerRect: any;
    refreshSize() {
        this.contentRect = this.contentScroller.getViewportRect();
        this.scrollerRect = this.scroller.getViewportRect();
    }

}
