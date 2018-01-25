import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { FlexHoverDirective } from './hover';
import { DesignModule } from './design/design.module';
import { components, getComponentsArray } from './components/index';


@NgModule({
  declarations: [
    AppComponent,
    FlexHoverDirective,
    ...getComponentsArray(),
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    DesignModule.forRoot(components)
  ],
  providers: [],
  entryComponents: [
    ...getComponentsArray()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
