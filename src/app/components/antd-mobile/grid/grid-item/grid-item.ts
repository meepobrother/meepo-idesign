import {
    ViewEncapsulation, Component, ElementRef,
    Renderer2, ChangeDetectionStrategy, HostListener,
    Input
} from '@angular/core';
import { Antd } from '../../antd';
import { FlexItemComponent  } from '../../flex/flex-item/flex-item';
@Component({
    selector: '[gridItem],grid-item',
    templateUrl: './grid-item.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridItemComponent extends FlexItemComponent {
    @HostListener('touchstart', ['$event'])
    touchstart(e) {
        this.setActive(true);
    }
    @HostListener('touchend', ['$event'])
    touchend(e) {
        this.setActive(false);
    }

    _active: string;
    @Input() 
    set active(val: any){
        this._active = val ? val : 'am-grid-item-active'
    }
    constructor(
        ele: ElementRef,
        render: Renderer2
    ) {
        super(ele, render);
        this.addToClass('am-grid-item', true, false)
    }

    setActive(val: any) {
        this.addToClass(this._active, this.isMeepoTrue(val), false);
    }
}
