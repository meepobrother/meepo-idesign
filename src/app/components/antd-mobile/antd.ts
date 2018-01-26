import { ansycClassObj, isMeepoTrue, setClassObj } from 'meepo-common';
import { Renderer2, ElementRef, Input, HostBinding } from '@angular/core';
export class Antd {
    _class: Object = {};
    _name: string = 'am-';
    @Input()
    set class(val: any) {
        this._class[val] = true;
    }

    @HostBinding(`class`)
    get flexClass() {
        return this.classNames.call(null, this._class);
    }

    constructor(
        public ele: ElementRef,
        public render: Renderer2,
        name: string
    ) {
        this._name = `am-${name}`;
        this._class[this._name] = true;
    }

    classNames() {
        const hasOwn = {}.hasOwnProperty;
        const classes = [];
        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i];
            if (!arg) continue;
            const argType = typeof arg;
            if (argType === 'string' || argType === 'number') {
                classes.push(arg);
            } else if (Array.isArray(arg) && arg.length) {
                const inner = this.classNames.apply(null, arg);
                if (inner) {
                    classes.push(inner);
                }
            } else if (argType === 'object') {
                for (const key in arg) {
                    if (hasOwn.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
        return classes.join(' ');
    }

    addToClass(name, val, hasPre: boolean = true) {
        if (hasPre) {
            this._class[`${this._name}${name}`] = val;
        } else {
            this._class[`${name}`] = val;
        }
    }

    /**
     * 是否存在class
     */
    hasClass(className: string) {
        const originClass = this.ele.nativeElement.className;
        return ` ${originClass} `.indexOf(` ${className} `) > -1;
    }
    /**
     * 添加一个class
     */
    addClass(className: string): void {
        if (this.hasClass(className)) {
            return;
        }
        this.render.addClass(this.ele.nativeElement, className);
    }
    // 设置单个样式
    setStyle(name: string, value: string): void {
        this.render.setStyle(this.ele.nativeElement, name, value);
    }
    // 批量设置样式
    setStyleObj(styleObj: any) {
        for (const key in styleObj) {
            this.setStyle(key, styleObj[key]);
        }
    }
    /**
     * 移除一个class
     */
    removeClass(className: string): void {
        if (this.hasClass(className)) {
            this.render.removeClass(this.ele.nativeElement, className);
        }
    }
    // [ngClass]="{}"
    ngClass(obj: any, name: string) {
        for (const key in obj) {
            if (obj[key]) {
                this.addClass(key);
            } else {
                this.removeClass(key);
            }
        }
        return ansycClassObj(obj, name);
    }
    // 是否为真
    isMeepoTrue(val: string) {
        return isMeepoTrue(val);
    }

    setClassObj(arrs, val, pre: string = '') {
        this._class = setClassObj(arrs, this._class, val, this._name + pre);
    }

    _getPosition(event: MouseEvent | TouchEvent) {
        let xPos, yPos, rect;
        rect = this.ele.nativeElement.getBoundingClientRect();
        if (event instanceof TouchEvent) {
            xPos = event.touches[0].clientX - rect.left;
            yPos = event.touches[0].clientY - rect.top;
        } else {
            xPos = event.clientX - rect.left;
            yPos = event.clientY - rect.top;
        }
        return {
            x: xPos,
            y: yPos
        };
    }
}

