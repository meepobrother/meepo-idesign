import {
    ViewEncapsulation, Component,
    Input, ElementRef, Renderer2,
    ChangeDetectionStrategy,
    ContentChild, TemplateRef
} from '@angular/core';
import { Antd } from '../antd';
@Component({
    selector: '[grid],grid',
    templateUrl: './grid.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./grid.less', './patch.less']
})
export class GridComponent extends Antd {
    groups: any[] = [];
    @ContentChild(TemplateRef) tpl: TemplateRef<any>;
    // 传入的菜单数据
    _data: any[] = [];
    @Input()
    set data(val: any[]) {
        if (val) {
            this._data = val;
            this._splice();
        }
    }

    // 列数
    _columnNum: number = 4;
    @Input()
    set columnNum(val: number) {
        if (val) {
            this._columnNum = val;
            this._splice();
        }
    }

    // 是否跑马灯
    @Input() isCarousel: boolean = false;

    // 如果是跑马灯, 一页跑马灯需要展示的行数
    _carouselMaxRow: number = 2;
    @Input()
    set carouselMaxRow(val: number) {
        this._carouselMaxRow = val;
    }
    // 是否有边框
    @Input()
    set hasLine(val) {
        this.addToClass('-line', this.isMeepoTrue(val));
    }

    // 每个格子是否固定为正方形
    @Input()
    set square(val: any) {
        this.addToClass('-square', this.isMeepoTrue(val));
    }

    // 点击反馈的自定义样式 (设为 false 时表示禁止点击反馈)
    @Input()
    set activeStyle(val: boolean) { }

    // 点击反馈的自定义类名
    _activeClassName: string = '';
    @Input()
    set activeClassName(val: string) {
        this._activeClassName = val;
    }
    get activeClassName() {
        return this._activeClassName;
    }
    // 每个格子自定义样式
    _itemStyle: any;
    @Input()
    set itemStyle(val: Object) {
        this._itemStyle = val;
    }
    get itemStyle() {
        return this._itemStyle;
    }
    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render, 'grid');
    }
    // 数据分组
    private _splice() {
        const columnNum = this._columnNum!;
        const carouselMaxRow = this._carouselMaxRow!;
        const dataLength = this._data.length;
        let rowCount = Math.ceil(dataLength / columnNum);
        if (this.isCarousel) {
            if (rowCount % carouselMaxRow !== 0) {
                rowCount = rowCount + carouselMaxRow - rowCount % carouselMaxRow;
            }
            const pageCount = Math.ceil(rowCount / carouselMaxRow);
            this.getRows(rowCount, dataLength);
        } else {
            this.getRows(rowCount, dataLength);
        }
    }

    private getRows(rowCount, dataLength) {
        const columnNum = this._columnNum!;
        const data = [];
        for (let i = 0; i < rowCount; i++) {
            const rowArr: any[] = [];
            for (let j = 0; j < columnNum; j++) {
                const dataIndex = i * columnNum + j;
                if (dataIndex < dataLength) {
                    rowArr.push({ data: this._data[dataIndex], index: dataIndex });
                } else {
                    rowArr.push({ index: dataIndex, data: null });
                }
            }
            data[i] = rowArr;
        }
        this.groups = data;
    }
}
