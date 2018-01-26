import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view';
import { ListModule } from '../list';
import { ScrollDispatchModule, ViewportRuler } from '@angular/cdk/scrolling';
import { AntdPlatformModule } from '../platform';
import { IconModule } from '../icon';


@NgModule({
    imports: [
        CommonModule,
        ListModule,
        AntdPlatformModule,
        ScrollDispatchModule,
        IconModule.forChild(['loading'])
    ],
    exports: [
        ListViewComponent
    ],
    declarations: [
        ListViewComponent
    ],
    providers: [
        ViewportRuler
    ],
})
export class ListViewModule { }
