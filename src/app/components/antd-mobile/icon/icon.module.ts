import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from './icon';
import { IconStore, ICONS, ICON_ROOT } from './icon.service';

export function iconStoreFactory(iconStore: IconStore, inject) {
    return iconStore || new IconStore(inject);
}

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        IconComponent,
    ],
    declarations: [
        IconComponent,
    ],
    providers: [],
})
export class IconModule {
    public static forRoot(root: string, icons: any[]): ModuleWithProviders {
        return {
            ngModule: IconModule,
            providers: [
                { provide: ICON_ROOT, useValue: root },
                { provide: ICONS, useValue: icons, multi: true },
                {
                    provide: IconStore,
                    useFactory: iconStoreFactory,
                    deps: [[new Optional(), new SkipSelf(), IconStore], Injector]
                }
            ]
        }
    }

    public static forChild(icons: any[]): ModuleWithProviders {
        return {
            ngModule: IconModule,
            providers: [
                { provide: ICONS, useValue: icons, multi: true }
            ]
        }
    }
}
