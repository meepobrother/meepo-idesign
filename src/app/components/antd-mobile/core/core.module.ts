import { Directive, OnInit, ElementRef, NgModule } from '@angular/core';

@Directive({ selector: '[domReady]' })
export class DomReadyDirective implements OnInit {
    constructor(
        public ele: ElementRef
    ) {
        console.log(new Date().getTime());
    }
    ngOnInit() {
        console.log(this.ele.nativeElement.target);
        console.log(new Date().getTime());
    }
}
@NgModule({
    imports: [],
    exports: [
        DomReadyDirective
    ],
    declarations: [
        DomReadyDirective
    ],
    providers: [],
})
export class AntdCoreModule { }

