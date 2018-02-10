import { MeepoMobileDefault, MeepoMobilePreviewComponent } from './meepo-mobile-preview/meepo-mobile-preview';
import { MeepoMobileSettingComponent } from './meepo-mobile-setting/meepo-mobile-setting';

export const both = {
    'meepo-mobile': {
        setting: MeepoMobileSettingComponent,
        view: MeepoMobilePreviewComponent,
        default: MeepoMobileDefault
    }
};

export const preview = {
    'meepo-mobile': MeepoMobilePreviewComponent
};

export const entrys = [
    MeepoMobileSettingComponent,
    MeepoMobilePreviewComponent
];
