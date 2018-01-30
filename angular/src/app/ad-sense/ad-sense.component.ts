import { Component, OnInit, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

declare var window;

@Component({
  selector: 'app-ad-sense',
  templateUrl: './ad-sense.component.html',
  styleUrls: ['./ad-sense.component.css']
})
export class AdSenseComponent implements OnInit, AfterViewInit {

  @Input() public adSlot: string = '7542695710';
  @Input() public delay: number = 2000;

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
    }, this.delay);
}

}
