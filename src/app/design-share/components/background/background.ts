import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
export interface ShareBackgroundProps {
    background: string | null;
    backgroundAttachment: string | null;
    backgroundClip: string | null;
    backgroundColor: string | null;
    backgroundImage: string | null;
    backgroundOrigin: string | null;
    backgroundPosition: string | null;
    backgroundPositionX: string | null;
    backgroundPositionY: string | null;
    backgroundRepeat: string | null;
    backgroundSize: string | null;
}
@Component({
    selector: 'share-background',
    templateUrl: './background.html'
})
export class ShareBackgroundComponent implements OnInit {
    @Input() props: FormGroup;
    constructor() { }
    ngOnInit() { }

    backgroundImageChange(e: any) {
        this.props.get('background-image').setValue(`url(${e.target.value})`);
    }
}
