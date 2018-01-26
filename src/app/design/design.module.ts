import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignLibraryProp, DesignLibraryService } from './types';
import { DESIGN_COMPONENTS, DesignService } from './design.service';
import { NgComponentDirective } from './ng-component';

import {
    DesignLibraryComponent, DesignComponent,
    DesignHistoryComponent, DesignPreviewComponent,
    DesignSettingComponent, DesignPagesComponent
} from './design';
import { CanDropDirective, CanDragDirective } from './drop-drag';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: 'design',
            component: DesignComponent
        }])
    ],
    exports: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective,
        NgComponentDirective, DesignPagesComponent,
    ],
    declarations: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective,
        NgComponentDirective, DesignPagesComponent,
    ],
    providers: [
        DesignService,
        DesignLibraryService
    ],
})
export class IDesignModule { }
