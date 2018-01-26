import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlexHoverDirective } from './hover';
import { IDesignModule } from './design/design.module';
import { components, entryComponents, libraryComponents, PreviewComponents } from './components/index';

import { DESIGN_COMPONENTS } from './design/design.service';
import { IpreviewComponent } from './preview/preview';
import { DESIGN_LIBRARYS } from './design/types';

@NgModule({
  declarations: [
    AppComponent,
    IpreviewComponent,
    FlexHoverDirective,
    ...entryComponents,
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
    IDesignModule,
    FormsModule
  ],
  providers: [
    {
      provide: DESIGN_COMPONENTS,
      useValue: components,
      multi: true
    },
    {
      provide: DESIGN_LIBRARYS,
      useValue: libraryComponents,
      multi: true
    }
  ],
  entryComponents: [
    ...entryComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
