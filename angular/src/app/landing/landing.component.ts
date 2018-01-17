import { Component, OnInit } from '@angular/core';

declare const jQuery: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

    jQuery('.counter').counterUp({
        delay: 10,
        time: 2000
    });
}

}
