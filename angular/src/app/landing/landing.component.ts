import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

declare const jQuery: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewChecked {

  constructor(private api: ApiService) { }

  public info: any = null;
  public checked: boolean = false;

  @ViewChild('counterUp') counterUp:ElementRef;

  ngOnInit() {
      this.api.getLanguaInfo().then(info => this.info = info.other);
    jQuery('.bannercontainerV1 .fullscreenbanner').revolution({
        delay: 5000,
        startwidth: 1170,
        startheight: 560,
        fullWidth: "on",
        fullScreen: "off",
        hideCaptionAtLimit: "",
        dottedOverlay: "twoxtwo",
        navigationStyle: "preview4",
        fullScreenOffsetContainer: "",
        hideTimerBar:"on",

    });
}

ngAfterViewChecked() {
    if (this.counterUp && this.checked === false) {
        this.checked = true;
        jQuery('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }
}

}
