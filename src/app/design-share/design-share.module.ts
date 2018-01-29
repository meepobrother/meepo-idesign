import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgComponentDirective, DRAG_DROP_ALL } from './ng-component';
import { DESIGN_LIBRARYS, DesignLibraryService, DesignApiService, DesignPropsService } from './types';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { shareComponents } from './components/public_api';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        NgComponentDirective,
        ...shareComponents
    ],
    declarations: [
        NgComponentDirective,
        ...shareComponents
    ],
    providers: [
        DesignApiService,
        DesignLibraryService,
        DesignPropsService
    ],
})
export class IDesignComponentModule {
    public static forRoot(coms: any, dragDropAll: boolean = false): ModuleWithProviders {
        return {
            ngModule: IDesignComponentModule,
            providers: [{
                provide: DESIGN_LIBRARYS,
                useValue: coms,
                multi: true
            },{
                provide: DRAG_DROP_ALL,
                useValue: dragDropAll
            }]
        }
    }
}
