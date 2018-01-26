import { Component, OnInit, KeyValueDiffers, ElementRef, Renderer2 } from '@angular/core';
import { ReactComponent } from 'ng-react-component';
import { DesignService } from '../design/design.service';
import { PreviewComponents } from '../components/index';

@Component({
    selector: 'ipreview',
    templateUrl: './preview.html',
    styleUrls: ['./preview.scss']
})
export class IpreviewComponent extends ReactComponent<any, any> {
    components: any[] = [];
    constructor(
        differs: KeyValueDiffers,
        private history: DesignService,
        render: Renderer2,
        ele: ElementRef
    ) {
        super(differs, ele, render);
        this.history.data$.subscribe(res=>{
            console.log(res);
            this.components = res;
        });
    }
    ngOnInit() {
        this.history.backToHistory();
    }
    onStateChange() { }
    onPropsChange() { }
}
