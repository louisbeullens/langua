import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

declare var window;

@Component({
  selector: 'app-ad-sense',
  templateUrl: './ad-sense.component.html',
  styleUrls: ['./ad-sense.component.css']
})
export class AdSenseComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
        try {
            (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        } catch (e) {
            console.error("error");
        }
    }, 1000);
}

}
