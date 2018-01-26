import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignLibraryProp } from './types';
import { DESIGN_COMPONENTS, DesignService } from './design.service';
import { NgComponentDirective } from './ng-component';
export function designServiceFactory(designService: DesignService, injector: any, comps: any) {
    return designService || new DesignService(injector, comps);
}
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
        {
            provide: DesignService,
            useFactory: designServiceFactory,
            deps: [[new Optional(), new SkipSelf(), DesignService], Injector, DESIGN_COMPONENTS]
        }
    ],
})
export class IDesignModule { }
