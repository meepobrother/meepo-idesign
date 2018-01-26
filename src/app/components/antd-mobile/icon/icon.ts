import {
    ViewEncapsulation, Component,
    Input, HostBinding, OnInit,
    InjectionToken, Inject, ChangeDetectionStrategy
} from '@angular/core';
import { setClassObj, isMeepoTrue } from 'meepo-common';
import { HttpClient } from '@angular/common/http';
import { IconStore } from './icon.service';

@Component({
    selector: 'icon',
    templateUrl: './icon.html',
    styleUrls: ['./icon.less', './patch.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
    _classObj: Object = { [`am-icon`]: true };
    @Input() type: string;
    @Input()
    set name(val: string) {
        this.type = val;
    }
    @Input()
    set src(val: string) {
        this.type = val;
    }

    @Input()
    set size(val: 'xss' | 'xs' | 'sm' | 'md' | 'lg') {
        this._classObj = setClassObj('xss,xs,sm,md,lg', this._classObj, val, 'am-icon');
    }
    @Input()
    set loading(val: any) {
        this._classObj['am-icon-loading'] = isMeepoTrue(val);
    }

    constructor(
        public icon: IconStore
    ) { }
}
