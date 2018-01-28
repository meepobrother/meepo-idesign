import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgComponentDirective, DRAG_DROP_ALL } from './ng-component';
import { DESIGN_LIBRARYS, DesignLibraryService, DesignApiService, DesignPropsService } from './types';

@NgModule({
    imports: [],
    exports: [
        NgComponentDirective
    ],
    declarations: [
        NgComponentDirective
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
