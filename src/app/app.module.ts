import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FlexHoverDirective } from './hover';
import { IDesignModule } from './design/design.module';
import { DESIGN_COMPONENTS } from 'meepo-idesign-share';
import { IpreviewComponent } from './preview/preview';
import { We7RouterModule } from 'meepo-we7-router';
import { components, runnerPage } from './components/public_api';
import { both as flexBoth, entrys as flexEntrys, preview as flexPreview } from './components/weui-flex/public_api';
import { both as imageBoth, entrys as imageEntrys, preview as imagePreview } from './components/weui-image/public_api';
import { both as buttonBoth, entrys as buttonEntrys, preview as buttonPreview } from './components/weui-button/public_api';

import { both as headerBoth, entrys as headerEntrys, preview as headerPreview } from './components/weui-header/public_api';
import { both as bodyBoth, entrys as bodyEntrys, preview as bodyPreview } from './components/weui-body/public_api';
import { both as footerBoth, entrys as footerEntrys, preview as footerPreview } from './components/weui-footer/public_api';
import { both as cubeBoth, entrys as cubeEntrys, preview as cubePreview } from './components/weui-cube/public_api';
import { both as swiperBoth, entrys as swiperEntrys, preview as swiperPreview } from './components/weui-swiper/public_api';

import { both as meepoSmsBoth, entrys as meepoSmsEntrys, preview as meepoSmsPreview } from './components/meepo-sms/public_api';


import { DESIGN_LIBRARYS, IDesignComponentModule } from 'meepo-idesign-share';

@NgModule({
  declarations: [
    AppComponent,
    IpreviewComponent,
    FlexHoverDirective,
    ...flexEntrys,
    ...imageEntrys,
    ...buttonEntrys,
    ...headerEntrys,
    ...bodyEntrys,
    ...footerEntrys,
    ...cubeEntrys,
    ...swiperEntrys,
    ...meepoSmsEntrys
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: '',
      pathMatch: 'full',
      redirectTo: 'design'
    }, {
      path: 'preview',
      component: IpreviewComponent
    }], { useHash: true }),
    IDesignModule.forRoot(runnerPage),
    FormsModule,
    ReactiveFormsModule,
    IDesignComponentModule.forRoot([], true)
  ],
  providers: [
    {
      provide: DESIGN_COMPONENTS,
      useValue: components,
      multi: true
    },
    {
      provide: DESIGN_LIBRARYS,
      useValue: [
        flexBoth,
        imageBoth,
        buttonBoth,
        headerBoth,
        bodyBoth,
        footerBoth,
        cubeBoth,
        swiperBoth,
        meepoSmsBoth
      ],
      multi: true
    }
  ],
  entryComponents: [
    ...flexEntrys,
    ...imageEntrys,
    ...buttonEntrys,
    ...headerEntrys,
    ...bodyEntrys,
    ...footerEntrys,
    ...cubeEntrys,
    ...swiperEntrys,
    ...meepoSmsEntrys
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
