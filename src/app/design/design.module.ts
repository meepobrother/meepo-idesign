import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignLibraryProp } from './types';
import { DESIGN_COMPONENTS, DesignService } from './design.service';

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
        DesignService
    ],
})
export class DesignModule {
    public static forRoot(coms: DesignLibraryProp[] = []): ModuleWithProviders {
        return {
            ngModule: DesignModule,
            providers: [{
                provide: DESIGN_COMPONENTS,
                useValue: coms,
                multi: true
            }]
        }
    }
}
