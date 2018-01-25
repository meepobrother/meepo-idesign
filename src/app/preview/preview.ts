import { Component, OnInit, KeyValueDiffers } from '@angular/core';
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
        private history: DesignService
    ) {
        super(differs);
    }
    ngOnInit() {
        const history = this.history.getHistory()[0];
        const components = history.data;
        components.map(res => {
            res.preview = this.getComponentByName(res.name)
        });
        this.components = components;
    }
    onStateChange() { }
    onPropsChange() { }

    getComponentByName(name: string) {
        let com: any;
        PreviewComponents.map(res=>{
            if(res.name === name){
                com = res;
            }
        });
        return com;
    }
}
