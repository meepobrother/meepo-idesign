import {
    NgModule, ModuleWithProviders, Optional,
    SkipSelf, Injector, ModuleWithComponentFactories,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignLibraryProp, DesignLibraryService, IDesignComponentModule } from 'meepo-idesign-share';
import { entrys as meepoMobileEntrys } from './meepo-mobile/public_api';
import {
    DesignLibraryComponent, DesignComponent,
    DesignHistoryComponent, DesignPagesComponent,
    DESIGN_PAGES
} from './design';
import { CanDropDirective, CanDragDirective } from './drop-drag';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: 'design',
            component: DesignComponent
        }]),
        IDesignComponentModule.forRoot([]),
        ReactiveFormsModule
    ],
    exports: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, CanDropDirective, CanDragDirective,
        DesignPagesComponent
    ],
    declarations: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, CanDropDirective, CanDragDirective,
        DesignPagesComponent, ...meepoMobileEntrys
    ],
    providers: [],
})
export class IDesignModule {
    static forRoot(pages: any[] = []): ModuleWithProviders {
        return {
            ngModule: IDesignModule,
            providers: [{
                provide: DESIGN_PAGES,
                useValue: pages
            }]
        }
    }
}
