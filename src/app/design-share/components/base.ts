import { OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
export class ControlBase {
    @Input() ele: HTMLElement;
    @Input() props: FormGroup;
    constructor() { }
    checkControl(name: string, _default: string = '') {
        if (!this.props.contains(name)) {
            this.createControl(name, _default);
        }
    }

    getStyle(name: string) {
        if (this.ele) {
            return this.ele.style[this.strToHump(name)];
        } else {
            return '';
        }
    }

    strToHump(name: string) {
        const re = /-(\w)/g;
        return name.replace(re, function ($0, $1) {
            return $1.toUpperCase();
        });
    }

    createControl(name: string, _default: string) {
        this.props.addControl(name, new FormControl(_default));
    }

    pxToNumber(px: string) {
        if (!px) {
            return '0';
        }
        return px.replace('px', '');
    }
}

