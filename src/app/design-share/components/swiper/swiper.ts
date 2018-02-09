import { Component, OnInit, Input } from '@angular/core';
import { ControlBase } from '../base';

@Component({
    selector: 'share-swiper',
    templateUrl: './swiper.html'
})

export class ShareSwiperComponent extends ControlBase implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {
        this.checkControl('loop', 'true');
        this.checkControl('speed', '300');
        this.checkControl('delay', '3000');
        this.checkControl('effect', 'slide');
        this.checkControl('pagination', 'bullets');
    }
}
