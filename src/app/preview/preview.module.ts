import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IpreviewComponent } from './preview';
import { ReactCommonModule } from 'ng-react-component';
@NgModule({
    imports: [
        RouterModule.forChild([{
            path: '',
            component: IpreviewComponent
        }]),
        CommonModule,
        ReactCommonModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [IpreviewComponent],
    providers: [],
})
export class IPreviewModule { }
