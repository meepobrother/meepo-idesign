import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactCommonModule } from 'ng-react-component';

import { AntdBadgeComponent } from './badge';
import { BadgeSettingComponent } from './badge-setting/badge-setting';
@NgModule({
    imports: [CommonModule, FormsModule, ReactCommonModule],
    exports: [AntdBadgeComponent, BadgeSettingComponent],
    declarations: [AntdBadgeComponent, BadgeSettingComponent],
    providers: [],
})
export class AntdBadgegModule { }
