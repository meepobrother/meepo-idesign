import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsComponent } from './tabs';
import { TabItemComponent } from './tab-item/tab-item';
import { TabPanelComponent } from './tab-panel/tab-panel';


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        TabsComponent,
        TabItemComponent,
        TabPanelComponent
    ],
    declarations: [
        TabsComponent,
        TabItemComponent,
        TabPanelComponent
    ],
    providers: [],
})
export class TabsModule { }
