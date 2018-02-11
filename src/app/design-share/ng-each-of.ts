
import {
    ChangeDetectorRef, Directive, DoCheck, EmbeddedViewRef, Input,
    IterableChangeRecord, IterableChanges, IterableDiffer,
    IterableDiffers, NgIterable, OnChanges, SimpleChanges, TemplateRef,
    TrackByFunction, ViewContainerRef, forwardRef, isDevMode
} from '@angular/core';

import {
    KeyValueDiffer, KeyValueChanges, KeyValueChangeRecord,
    KeyValueDifferFactory, KeyValueDiffers
} from '@angular/core';

export interface EachKeyValue<T> {
    [key: string]: T;
}

export class NgEachOfContext<T> {
    constructor(
        public $implicit: T,
        public ngEachOf: EachKeyValue<T>,
        public key: string,
    ) { }
}

@Directive({ selector: '[ngEach][ngEachOf]' })
export class NgEachOf<T> implements OnChanges {
    @Input() ngEachOf: EachKeyValue<T>;
    private _differ: KeyValueDiffer<string, T> | null = null;
    constructor(
        private _viewContainer: ViewContainerRef,
        private _template: TemplateRef<NgEachOfContext<T>>,
        private _differs: KeyValueDiffers
    ) { }
    @Input()
    set ngForTemplate(value: TemplateRef<NgEachOfContext<T>>) {
        if (value) {
            this._template = value;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        this._viewContainer.clear();
        if ('ngEachOf' in changes) {
            const value = changes['ngEachOf'].currentValue;
            this._applyChanges(value);
        }
    }

    private _applyChanges(changes: any[]) {
        for (const key in changes) {
            const item = changes[key];
            const view = this._viewContainer.createEmbeddedView(
                this._template,
                new NgEachOfContext<T>(item, this.ngEachOf, key),
                parseInt(key, 16)
            );
        }
    }
}
