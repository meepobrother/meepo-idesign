import {
  Component, ViewContainerRef,
  OnInit, Injector, ComponentFactoryResolver
} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DESIGN_COMPONENTS } from './design/design.service';
import { NgModuleRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor() { }
  ngOnInit() { }
}
