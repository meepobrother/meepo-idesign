import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignLibraryProp } from './types';
import { DESIGN_COMPONENTS, DesignService } from './design.service';

export function designServiceFactory(designService: DesignService, injector: any, comps: any) {
    return designService || new DesignService(injector, comps);
}

import {
    DesignLibraryComponent, DesignComponent,
    DesignHistoryComponent, DesignPreviewComponent,
    DesignSettingComponent
} from './design';
import { CanDropDirective, CanDragDirective } from './drop-drag';
@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective
    ],
    declarations: [
        DesignLibraryComponent, DesignComponent,
        DesignHistoryComponent, DesignPreviewComponent,
        DesignSettingComponent, CanDropDirective, CanDragDirective
    ],
    providers: [
        {
            provide: DesignService,
            useFactory: designServiceFactory,
            deps: [[new Optional(), new SkipSelf(), DesignService], Injector, DESIGN_COMPONENTS]
        }
    ],
})
export class DesignModule { }
