import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('quickStart') public quickStart: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  goToQuickStart() {
    if (this.quickStart) {
      this.quickStart.nativeElement.scrollIntoView({behavior: 'smooth'});
    }
  }

}
