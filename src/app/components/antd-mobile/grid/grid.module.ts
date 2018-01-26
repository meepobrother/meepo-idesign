import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridComponent } from './grid';
import { GridItemComponent } from './grid-item/grid-item';
import { FlexModule } from '../flex/flex.module';

@NgModule({
    imports: [
        CommonModule,
        FlexModule
    ],
    exports: [
        GridComponent,
        GridItemComponent
    ],
    declarations: [
        GridComponent,
        GridItemComponent
    ],
    providers: [],
})
export class GridModule { }
