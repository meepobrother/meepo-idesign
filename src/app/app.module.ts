import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlexHoverDirective } from './hover';
import { IDesignModule } from './design/design.module';
import { components, entryComponents } from './components/index';
import { DESIGN_COMPONENTS } from './design/design.service';
import { IPreviewModule } from './preview/preview.module';
@NgModule({
  declarations: [
    AppComponent,
    FlexHoverDirective,
    ...entryComponents,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: '',
      pathMatch: 'full',
      redirectTo: 'design'
    },{
      path: 'preview',
      loadChildren: 'app/preview/preview.module#IPreviewModule'
    }], { useHash: true }),
    IDesignModule,
    FormsModule
  ],
  providers: [
    {
      provide: DESIGN_COMPONENTS,
      useValue: components,
      multi: true
    }
  ],
  entryComponents: [
    ...entryComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
