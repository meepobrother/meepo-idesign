import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { Platform } from '@angular/cdk/platform';

export class AntdPlatform extends Platform {
    WEIXIN: boolean = /(MicroMessenger)/i.test(navigator.userAgent);
    /**
     * 是否微信
     */
    isWechat(): boolean {
        return this.WEIXIN;
    }
    /**
     * 是否android
     */
    isAndroid(): boolean {
        return this.ANDROID;
    }
    /**
     * 是否ios
     */
    isIos(): boolean {
        return this.IOS;
    }
}

@NgModule({
    imports: [
        CommonModule,
        PlatformModule
    ],
    exports: [
        PlatformModule
    ],
    providers: [
        { provide: Platform, useClass: AntdPlatform }
    ]
})
export class AntdPlatformModule { }
