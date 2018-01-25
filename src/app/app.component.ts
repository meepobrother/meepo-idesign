import { Component, ViewContainerRef, OnInit, Injector } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DESIGN_COMPONENTS } from './design/design.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private view: ViewContainerRef,
    private injector: Injector
  ) { }

  ngOnInit() { }
}
