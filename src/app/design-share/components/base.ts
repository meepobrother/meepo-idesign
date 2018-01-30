import { OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
export class ControlBase {
    @Input() props: FormGroup;
    constructor() { }
    checkControl(name: string, _default: string = '') {
        try {
            const control = this.props.get(name);
            if (!control) {
                this.createControl(name, _default);
            }
        } catch (err) {
            this.createControl(name, _default);
        }
    }

    createControl(name: string, _default: string) {
        this.props.addControl(name, new FormControl(_default));
    }

    pxToNumber(px: string) {
        return px.replace('px', '');
    }
}

