import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuComponent } from './menu';
import { MenuContainerDirective } from './menu-container/menu-container';
import { MenuSubmenuDirective } from './menu-submenu/menu-submenu';


import { FlexModule } from '../flex/flex.module';
import { ListModule } from '../list/list.module';


@NgModule({
    imports: [
        CommonModule,
        FlexModule,
        ListModule
    ],
    exports: [
        MenuComponent,
        MenuContainerDirective,
        MenuSubmenuDirective
    ],
    declarations: [
        MenuComponent,
        MenuContainerDirective,
        MenuSubmenuDirective
    ],
    providers: [],
})
export class MenuModule { }
