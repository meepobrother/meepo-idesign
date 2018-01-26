import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputItemComponent } from './input-item';
import { ListModule } from '../list/list.module';

@NgModule({
    imports: [
        CommonModule,
        ListModule
    ],
    exports: [
        InputItemComponent,
    ],
    declarations: [
        InputItemComponent,
    ],
    providers: [],
})
export class InputItemModule {
    
}
