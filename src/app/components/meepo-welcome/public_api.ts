import { MeepoWelcomeDefault, MeepoWelcomePreviewComponent } from './meepo-welcome-preview/meepo-welcome-preview';
import { MeepoWelcomeSettingComponent } from './meepo-welcome-setting/meepo-welcome-setting';

export const both = {
    'weui-welcome': {
        setting: MeepoWelcomeSettingComponent,
        view: MeepoWelcomePreviewComponent,
        default: MeepoWelcomeDefault
    }
};

export const preview = {
    'weui-welcome': MeepoWelcomePreviewComponent
};

export const entrys = [
    MeepoWelcomeSettingComponent,
    MeepoWelcomePreviewComponent
];

