import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexComponent } from './flex';
import { FlexItemComponent } from './flex-item/flex-item';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        FlexComponent,
        FlexItemComponent
    ],
    declarations: [
        FlexComponent,
        FlexItemComponent
    ],
    providers: [],
})
export class FlexModule { }
