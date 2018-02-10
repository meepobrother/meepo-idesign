import {
    Component, KeyValueDiffers,
    ElementRef, Renderer2, HostListener
} from '@angular/core';
import { ReactComponentSetting, ReactComponent } from 'ng-react-component';
import { FormBuilder } from '@angular/forms';
import { DesignPropsService, DesignLibraryProp, DesignApiService } from 'meepo-idesign-share';

@Component({
    selector: 'meepo-mobile-setting',
    templateUrl: './meepo-mobile-setting.html',
    styleUrls: ['./meepo-mobile-setting.scss']
})
export class MeepoMobileSettingComponent extends ReactComponentSetting<any, any> {
    element: HTMLElement;

    item: DesignLibraryProp;
    instance: ReactComponent<any, any>;

    constructor(
        _differs: KeyValueDiffers,
        _ele: ElementRef,
        _render: Renderer2,
        _fb: FormBuilder,
        p: DesignPropsService,
        public props: DesignPropsService,
        public api: DesignApiService,
    ) {
        super(_differs, _ele, _render, _fb, p);
    }

    ngOnInit() {
        this.element = this.instance.ele.nativeElement;
        this.initStyleForm();
    }

    onPropsChange() { }

    onStateChange() {
        console.log(this.state);
    }
    setSetting(com: DesignLibraryProp, instance?: any) {
        this.item = com;
        this.instance = instance;
    }
    setTopProps() {
        this.props.settingProps = null;
    }
    // 设置激活元素
    setItemProps(item: any) {
        const instance = this.api.get(item.uuid);
        this.props.setActiveSettingProps(item, instance.view.instance);
    }

    addComponent(e: any) {
        this.props.addPropsToInstanceByName(e);
    }

    removeComponent(uuid: string) {
        this.props.removePropsByUid(uuid);
    }

    toFatherProps(e: any) {
        this.props.toFatherProps();
    }
}
