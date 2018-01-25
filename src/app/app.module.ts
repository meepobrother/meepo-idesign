import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { FlexHoverDirective } from './hover';
import { DesignModule } from './design/design.module';
import { components, entryComponents } from './components/index';
import { DESIGN_COMPONENTS } from './design/design.service';
@NgModule({
  declarations: [
    AppComponent,
    FlexHoverDirective,
    ...entryComponents,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    DesignModule,
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
