import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeBarComponent } from './notice-bar';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        NoticeBarComponent,
    ],
    declarations: [
        NoticeBarComponent,
    ],
    providers: [],
})
export class NoticeBarModule { }
