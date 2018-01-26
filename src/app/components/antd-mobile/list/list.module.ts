import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list';
import { ListItemComponent } from './list-item/list-item';
import { ListHeaderDirective } from './list-header/list-header';
import { ListFooterDirective } from './list-footer/list-footer';
import { ListArrowDirective } from './list-arrow/list-arrow';
import { ListRippleDirective } from './list-ripple/list-ripple';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ListComponent,
        ListItemComponent,
        ListHeaderDirective,
        ListFooterDirective,
        ListArrowDirective,
        ListRippleDirective,
    ],
    declarations: [
        ListComponent,
        ListItemComponent,
        ListHeaderDirective,
        ListFooterDirective,
        ListArrowDirective,
        ListRippleDirective,
    ],
    providers: [],
})
export class ListModule { }
