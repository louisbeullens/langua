import { Component, OnInit } from '@angular/core';

declare const jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
