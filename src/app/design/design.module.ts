import {
    NgModule, ModuleWithProviders, Optional,
    SkipSelf, Injector, ModuleWithComponentFactories,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignLibraryProp, DesignLibraryService } from 'meepo-idesign-share';
import { DESIGN_COMPONENTS, DesignService } from './design.service';
import { IDesignComponentModule } from 'meepo-idesign-share';

import {
    DesignLibraryComponent, DesignComponent,
    DesignHistoryComponent, DesignPreviewComponent,
    DesignSettingComponent, DesignPagesComponent,
    DESIGN_PAGES
} from './design';
import { CanDropDirective, CanDragDirective } from './drop-drag';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: 'design',
            component: DesignComponent
        }]),
        IDesignComponentModule
    ],
    exports: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective,
        DesignPagesComponent, IDesignComponentModule
    ],
    declarations: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective,
        DesignPagesComponent,
    ],
    providers: [
        DesignService,
        DesignLibraryService
    ],
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
